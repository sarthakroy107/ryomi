import { AppRouteHandler } from "@/lib/types";
import {
  TProfileGETRoute,
  TProfilePUTRoute,
  TResetPassword,
  TResetPasswordGenerator,
} from "../routes/profile.route";
import { getUserByIdHelper } from "@/lib/helpers/user-details.helper";
import { updateProfile } from "@/lib/helpers/update-user.helper";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { initialiseDB } from "@/db";
import { createVerificationLink } from "@/lib/helpers/verification.helper";
import { userTable, verificationTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { sendEmail } from "@/lib/helpers/send-mail.helper";
import { getUserByEmail } from "@/lib/queries/user";

export const getProfileDetailsHanlder: AppRouteHandler<
  TProfileGETRoute
> = async (c) => {
  try {
    const user = c.get("user");
    if (!user || user.id === undefined) {
      return c.json(
        { message: `Unauthenticated: User not found` },
        401,
        awsHeaders
      );
    }

    const userData = await getUserByIdHelper(user.id);

    if (!userData || userData.length === 0) {
      return c.json({ message: `User not found: ${user.id}` }, 400, awsHeaders);
    }

    return c.json(userData[0], 200);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};

export const updateProfileHanlder: AppRouteHandler<TProfilePUTRoute> = async (
  c
) => {
  try {
    const user = c.get("user");
    if (!user || user.id === undefined) {
      return c.json(
        { message: `Unauthenticated: User not found` },
        401,
        awsHeaders
      );
    }

    const updatedDetails = c.req.valid("json");
    const dbUpdate = await updateProfile({
      userId: user.id,
      displayPic: updatedDetails.displayPic,
      name: updatedDetails.name,
      phoneNum: updatedDetails.phoneNum,
    });

    if (!dbUpdate || dbUpdate.length === 0) {
      return c.json({ message: `User not found: ${user.id}` }, 400, awsHeaders);
    }

    return c.json({ message: `Profile updated successfully` }, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};

export const resetPasswordGenerateHandler: AppRouteHandler<
  TResetPasswordGenerator
> = async (c) => {
  try {
    const { email } = c.req.valid("json");
    const user = await getUserByEmail(email);

    if (!user) {
      return c.json({ message: `User not found` }, 400, awsHeaders);
    }

    const veficationCode = await createVerificationLink(
      user.id,
      "reset-password"
    );
    console.log(`Verification code: ${veficationCode} | now sending email`);
    await sendEmail({
      destination: [user.email],
      subject: "Reset password",
      body: `Your verification code for passsword reset is: ${veficationCode}`,
      source: "no-reply@ryomi.site",
    });

    console.log(`Email sent`);

    return c.json(
      { message: `Verification link sent to email` },
      200,
      awsHeaders
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};

export const resetPasswordHandler: AppRouteHandler<TResetPassword> = async (
  c
) => {
  try {
    console.log("Reset password handler");
    const { password, verificationCode: code, userId } = c.req.valid("json");
    const db = await initialiseDB();

    const verificationCodes = await db
      .select()
      .from(verificationTable)
      .where(
        and(
          eq(verificationTable.userId, userId),
          eq(verificationTable.type, "password-reset")
        )
      );
    console.log("verificationCodes", verificationCodes);

    if (verificationCodes.length === 0) {
      return c.json(
        { message: `Verification code not found` },
        400,
        awsHeaders
      );
    }

    for (const verificationCode of verificationCodes) {
      const validCode = await compare(code, verificationCode.code);
      console.log("validCode", validCode);
      if (validCode) {
        await db
          .delete(verificationTable)
          .where(
            and(
              eq(verificationTable.userId, userId),
              eq(verificationTable.type, "password-reset")
            )
          );

        const hashedPassword = await hash(password, 10);
        await db
          .update(userTable)
          .set({
            password_hash: hashedPassword,
            updated_at: new Date(),
          })
          .where(eq(userTable.id, userId));

        return c.json(
          { message: `Password updated successfully` },
          200,
          awsHeaders
        );
      }
    }

    return c.json({ message: `Invalid verification code` }, 400, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};
