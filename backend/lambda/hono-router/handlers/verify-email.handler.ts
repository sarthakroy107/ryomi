import { AppRouteHandler } from "@/lib/types";
import { TVerifyEmailRoute } from "../routes/verify.route";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { initialiseDB } from "@/db";
import { verificationTable, userTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { initialiseLucia } from "@/lib/app/auth";

export const verifyEmaiiHandler: AppRouteHandler<TVerifyEmailRoute> = async (
  c
) => {
  try {
    const code = c.req.query("code");
    const userId = c.req.query("userId");
    console.log("code", code);
    console.log("email", userId);

    if (!code) {
      return c.json(
        { message: "Bad request: Code not found" },
        400,
        awsHeaders
      );
    }

    if (!userId) {
      return c.json(
        { message: "Bad request: Email not found" },
        400,
        awsHeaders
      );
    }

    const db = await initialiseDB();

    const emailVerificationCodes = await db
      .select()
      .from(verificationTable)
      .where(
        and(
          eq(verificationTable.userId, userId),
          eq(verificationTable.type, "account-activation")
        )
      );

    for (const emailVerificationCode of emailVerificationCodes) {
      console.log("emailVerificationCode", emailVerificationCode);
      const validCode = await compare(code, emailVerificationCode.code);
      if (validCode) {
        console.log("Email verified");
        console.log("Deleting email verification code");
        await db
          .delete(verificationTable)
          .where(eq(verificationTable.userId, userId));
        console.log("Email verification code deleted");
        console.log("Updating user email verification status");

        await db
          .update(userTable)
          .set({
            emailVerified: true,
          })
          .where(eq(userTable.id, userId));

        console.log("User email verification status updated");
        console.log("Creating session");

        const lucia = await initialiseLucia();

        const session = await lucia.createSession(userId, {});
        console.log("Session created");
        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          {
            append: true,
          }
        );
        c.header("Location", "/", { append: true });
        console.log("Headers set");
        return c.json({ message: "Email verified" }, 200, awsHeaders);
      }
    }

    console.log("Email verification failed: No matching token found");

    return c.json(
      { message: "Email verification failed: No matching token found" },
      400,
      awsHeaders
    );
  } catch (error) {
    console.error(error);
    return c.json({ message: `I.S.E: ${error}` }, 500, awsHeaders);
  }
};
