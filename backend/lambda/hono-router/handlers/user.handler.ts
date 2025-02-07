import { AppRouteHandler } from "@/lib/types";
import { TUserProfileRoute } from "../routes/user.route";
import { fetchUserDetailsByEmail } from "@/lib/helpers/user.helper";
import { awsHeaders } from "@/lib/app/aws-res-header";

export const userProfileHandler: AppRouteHandler<TUserProfileRoute> = async (
  c
) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json(
        { message: "Unauthorized: User not found" },
        401,
        awsHeaders
      );
    }

    const userDetails = await fetchUserDetailsByEmail(user.email);

    if (!userDetails) {
      return c.json(
        { message: "User details not found in DB" },
        404,
        awsHeaders
      );
    }

    return c.json({ ...userDetails }, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json({ message: `I.S.E: ${error}` }, 500, awsHeaders);
  }
};
