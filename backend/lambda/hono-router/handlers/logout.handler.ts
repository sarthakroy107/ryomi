import { AppRouteHandler } from "@/lib/types";
import { TLogoutRoute } from "../routes/logout.route";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { initialiseLucia } from "@/lib/app/auth";
import { honoEnv } from "../env";

export const logoutHandler: AppRouteHandler<TLogoutRoute> = async (c) => {
  try {
    const lucia = initialiseLucia(honoEnv?.DATABASE_URL);
    const session = c.get("session");

    if (session) {
      await lucia.invalidateSession(session.id);
    }

    const cookie = lucia.createBlankSessionCookie();

    c.header("Set-Cookie", cookie.serialize(), { append: true });

    return c.json({ message: "Logout successful" }, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json({ message: `I.S.E: ${error}` }, 500, awsHeaders);
  }
};
