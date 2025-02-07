import type { TDashboardRoute } from "../routes/user.route";
import { AppRouteHandler } from "@/lib/types";
import { getUserByEmail } from "@/lib/queries/user";
import { currentCredit } from "@/lib/queries/credit";
import { getOperationsByUserId } from "@/lib/helpers/operations.helper";
import { countUploadedFiles } from "@/lib/helpers/uploaded-file.helper";
import { CountUpcomingDeletions } from "@/lib/helpers/upcoming-deletions";
import { awsHeaders } from "@/lib/app/aws-res-header";

export const dashboadHanlder: AppRouteHandler<TDashboardRoute> = async (c) => {
  try {
    const user = c.get("user");

    if (!user || user.email === undefined || user.id === undefined) {
      return c.json({ message: "Unauthorized" }, 401, awsHeaders);
    }

    const userDetails = await getUserByEmail(user.email);
    const availableCredits = await currentCredit(user.id);
    const operations = await getOperationsByUserId({
      userId: user.id,
      status: "in-progress",
    });
    const uploadedFilesCount = await countUploadedFiles(user.id);
    return c.json(
      {
        credits: availableCredits,
        user: {
          dp: userDetails.displayPic,
          email: userDetails.email,
          id: userDetails.id,
          name: userDetails.name,
        },
        uploadedFiles: uploadedFilesCount,
        nextDeletions: await CountUpcomingDeletions({
          userId: user.id,
          days: 3,
        }),
        ongoingTasks: operations.length,
      },
      200,
      awsHeaders
    );
  } catch (error) {
    console.error(error);

    return c.json({ message: `Internal-server-error: ${error}` }, 500, awsHeaders);
  }
};
