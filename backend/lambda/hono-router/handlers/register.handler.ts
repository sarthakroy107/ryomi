import {
  createUser,
  isEmailUnique,
  isValidePassword,
} from "@/lib/queries/user";
import { AppRouteHandler } from "@/lib/types";
import { TRegisterRoute } from "../routes/register.route";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { createVerificationLink } from "@/lib/helpers/verification.helper";
import { sendEmail } from "@/lib/helpers/send-mail.helper";

export const registerUser: AppRouteHandler<TRegisterRoute> = async (c) => {
  try {
    const body = c.req.valid("json");

    if (!body.email || !body.password || !body.name) {
      c.status(400);
      return c.json(
        { message: "Missing email, password or name" },
        400,
        awsHeaders
      );
    }

    if (!isValidePassword(body.password)) {
      c.status(400);
      return c.json({ message: "Password not valid" }, 400, awsHeaders);
    }

    if (!(await isEmailUnique(body.email, true))) {
      console.log("Email already in use & activated");
      // console.log("Sending email to", body.email);
      // await sendEmail({
      //   body: `Email is already in use`,
      //   subject: "Already registered",
      //   destination: [body.email],
      //   source: "no-reply@ryomi.site",
      // });
      // console.log("Email sent");
      return c.json({ message: "Email already in use" }, 409, awsHeaders);
    }

    const user = await createUser({
      email: body.email,
      plain_password: body.password,
      name: body.name,
      display_pic: `https://ui-avatars.com/api/?name=${body.name
        .split(" ")
        .join("+")}&background=random`,
      // "https://avatarfiles.alphacoders.com/327/thumb-1920-327620.jpg",
      region: "NOT_KNOWN",
      campaign: null,
      phone_num: null,
      referred_by: null,
    });

    const verificationLink = await createVerificationLink(user.id);

    await sendEmail({
      body: `Click on the link to verify your email: ${verificationLink}`,
      subject: "Email verification",
      destination: [body.email],
      source: "no-reply@ryomi.site",
    });

    return c.json(
      { message: "Verification mail send successfully" },
      200,
      awsHeaders
    );
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};
