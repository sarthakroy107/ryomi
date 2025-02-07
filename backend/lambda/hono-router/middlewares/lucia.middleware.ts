import { Context, Next } from "hono";
import { initialiseLucia } from "@/lib/app/auth";
import { getCookie } from "hono/cookie";
import { awsHeaders } from "@/lib/app/aws-res-header";

export async function authMiddleware(c: Context, next: Next) {
  const lucia = initialiseLucia(process.env.DATABASE_URL || "");
  const sessionId = getCookie(c, lucia.sessionCookieName);

  if (!sessionId) {
    return c.json({ message: "Unauthorized:No session cookie found" }, 401, awsHeaders);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }

  c.set("user", user);
  c.set("session", session);

  return next();
}
