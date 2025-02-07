import { eq } from "drizzle-orm";
import { initialiseDB } from "../../db";
import { userCreditTable, SelectUser, userTable } from "../../db/schema";
import { ulid } from "ulidx";
import { hash } from "bcryptjs";
import { dateUTC } from "../app/date";

export async function isEmailUnique(
  email: string,
  isActivated: boolean = false
): Promise<boolean> {
  const db = await initialiseDB();
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (user === null || user.length === 0) return true;

  if (isActivated) {
    return !user[0].emailVerified;
  }

  return false;
}

export const isValidePassword = (password: string) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

export async function createUser({
  email,
  plain_password,
  name,
  region,
  campaign,
  display_pic,
  phone_num,
  referred_by,
}: {
  email: string;
  plain_password: string;
  name: string;
  region: string;
  campaign: string | null;
  phone_num: string | null;
  display_pic: string | null;
  referred_by: string | null;
}): Promise<SelectUser> {
  const db = await initialiseDB();

  const passwordHash = await hash(plain_password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.emailVerified) {
    throw new Error("Email already in use & activated");
  } else if (existingUser && !existingUser.emailVerified) {
    const updatedUser = await db
      .update(userTable)
      .set({
        name,
        region: region ?? "NOT_KNOWN",
        campaign,
        displayPic:
          display_pic ??
          "https://avatarfiles.alphacoders.com/327/thumb-1920-327620.jpg",
        phoneNum: phone_num,
        referred_by,
        password_hash: passwordHash,
        updated_at: dateUTC,
      })
      .where(eq(userTable.id, existingUser.id))
      .returning();

    return updatedUser[0];
  }

  const user = await db
    .insert(userTable)
    .values({
      id: ulid(),
      email,
      name,
      region: region ?? "NOT_KNOWN",
      campaign,
      displayPic:
        display_pic ??
        "https://avatarfiles.alphacoders.com/327/thumb-1920-327620.jpg",
      phoneNum: phone_num,
      referred_by,
      password_hash: passwordHash,
      created_at: dateUTC,
      updated_at: dateUTC,
    })
    .returning();

  await db.insert(userCreditTable).values({
    userId: user[0].id,
    creditAmount: 1000,
    updated_at: dateUTC,
  });

  return user[0];
}

export async function getUserByEmail(email: string): Promise<SelectUser> {
  const db = await initialiseDB();
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  return user[0];
}
