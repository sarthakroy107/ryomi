import { initialiseDB } from "@/db";
import { getUserByIdHelper } from "./user-details.helper";
import { verificationTable } from "@/db/schema";
import { hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";

export async function createVerificationLink(
  userId: string,
  route: "verify" | "reset-password" = "verify"
) {
  const db = await initialiseDB();
  const [user] = await getUserByIdHelper(userId, db);

  if (!user) {
    throw new Error("User not found");
  }

  const random4DDigitNumber =
    crypto.getRandomValues(new Uint32Array(1))[0] % 10000;

  const code = user.id + random4DDigitNumber.toString().padStart(4, "0");

  const hashedCode = await hash(code, 10);

  const expiresAt = new Date().getTime() + 1000 * 60 * 60 * 12; // 12 hours

  const existingVerification = await db
    .select()
    .from(verificationTable)
    .where(
      and(
        eq(verificationTable.userId, userId),
        eq(
          verificationTable.type,
          route === "verify" ? "account-activation" : "password-reset"
        )
      )
    );

  if (existingVerification.length > 0) {
    await db
      .delete(verificationTable)
      .where(
        and(
          eq(verificationTable.userId, userId),
          eq(
            verificationTable.type,
            route === "verify" ? "account-activation" : "password-reset"
          )
        )
      );
  }

  await db.insert(verificationTable).values({
    code: hashedCode,
    createdAt: new Date(),
    email: user.email,
    expiresAt: new Date(expiresAt),
    userId,
    type: route === "verify" ? "account-activation" : "password-reset",
  });

  return `https://ryomi.site/${route}?code=${code}&userId=${userId}`;
}
