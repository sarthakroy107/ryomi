import { AppRouteHandler } from "@/lib/types";
import {
  TCalculateCreditRoute,
  TCreditHistoryGETRoute,
} from "@/lambda/hono-router/routes/credit.route";
import { currentCredit } from "@/lib/helpers/current-credits.helper";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { initialiseDB } from "@/db";
import { getCreditTransactions } from "@/lib/services/credit.service";
import { calculateCredit } from "@/lib/helpers/credit-calculator.helper";
import { creditsUsedEachDay } from "@/lib/helpers/format-credits-by-date.helper";

export const GETCreditHistoryHandler: AppRouteHandler<
  TCreditHistoryGETRoute
> = async (c) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const db = await initialiseDB();

    const currentCredits = await currentCredit({ db, userid: user.id });

    const today = new Date();
    const startDate = new Date(new Date().setDate(today.getDate() - 30));
    const endDate = new Date(new Date().setDate(today.getDate()));

    console.log("Check point 1");

    const credtTransactions = await getCreditTransactions({
      db,
      userId: user.id,
      startDate,
      endDate,
    });

    const formattedCreditHistory = creditsUsedEachDay({
      startDate: startDate,
      endDate: endDate,
      data: credtTransactions,
    });

    console.log("Check point 3");

    return c.json(
      {
        currentAmount: currentCredits,
        recentUsage: {
          dates: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          usage: formattedCreditHistory,
          creditsUsed: formattedCreditHistory.reduce(
            (acc, curr) => acc + curr.used,
            0
          ),
        },
      },
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

export const POSTCreditCalculatorHandler: AppRouteHandler<
  TCalculateCreditRoute
> = async (c) => {
  try {
    const user = c.get("user");
    const db = await initialiseDB();

    if (!user || !user.id || !user.email) {
      return c.json({ message: "Unauthorized" }, 401, awsHeaders);
    }

    const creditsNeeded: number = await calculateCredit({
      db,
      reqData: c.req.valid("json"),
    });

    return c.json({ creditsNeeded, message: "jldkn" }, 200, awsHeaders);
  } catch (error) {
    console.error(error);

    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};
