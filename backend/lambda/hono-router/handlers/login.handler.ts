import { getUserByEmail } from "../../../lib/queries/user";
import { compare } from "bcryptjs";
import { initialiseLucia } from "../../../lib/app/auth";
import { honoEnv } from "../env";
import { AppRouteHandler } from "@/lib/types";
import { LoginRoute } from "@/lambda/hono-router/routes/login.route";
import { awsHeaders } from "@/lib/app/aws-res-header";

export const loginHandler: AppRouteHandler<LoginRoute> = async (c) => {
  try {
    const lucia = initialiseLucia(honoEnv?.DATABASE_URL);
    const existingSession = c.get("session");

    if (existingSession) {
      const user = c.get("user");
      return c.json(
        { message: "Already logged in", userId: user?.id ?? "Error" },
        200,
        awsHeaders
      );
    }
    const body = await c.req.json();

    if (!body.email || !body.password) {
      return c.json({ message: "Missing email or password" }, 400, awsHeaders);
    }

    const user = await getUserByEmail(body.email);

    if (!user) {
      return c.json({ message: "User not found" }, 400, awsHeaders);
    }

    const validPassword = await compare(body.password, user.password_hash);

    if (!validPassword) {
      return c.json(
        { message: `Invalid password: ${validPassword}` },
        400,
        awsHeaders
      );
    }

    const session = await lucia.createSession(user.id, {});
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
    c.header("Location", "/", { append: true });

    return c.json({ message: "Logged in", userId: user.id }, 200, awsHeaders);
  } catch (error) {
    console.log(error);

    return c.json({ message: `An error occurred:${error}` }, 500, awsHeaders);
  }
};
