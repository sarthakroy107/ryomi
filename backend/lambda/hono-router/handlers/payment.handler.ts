import { AppRouteHandler } from "@/lib/types";
import { z } from "zod";
import {
  TPaymentInformationRoute,
  TPaymentRoute,
  TRazorpayWeebhookRoute,
} from "../routes/payment.route";
import { awsHeaders } from "@/lib/app/aws-res-header";
import { honoEnv } from "../env";
import { checkPlan } from "@/lib/credit-calculation/check-plan";
import { ulid } from "ulidx";
import { insertPayment } from "@/lib/helpers/create-pg-transaction";
import { createHmac } from "crypto";
import { updatePaymentStatus } from "@/lib/helpers/update-payment";
import { initialiseDB } from "@/db";
import { updateCredit } from "@/lib/helpers/update-credit";
import { paymentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Razorpay = require("razorpay");
import { checkPaymentStatus } from "@/lib/helpers/payment-status.helper";

const secretKey = `panko`;

export const paymnetUrlHandler: AppRouteHandler<TPaymentRoute> = async (c) => {
  const { planId } = c.req.valid("json");

  if (!planId) {
    return c.json({ message: "Plan id not found" }, 400, awsHeaders);
  }

  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "User not found" }, 400, awsHeaders);
    }

    const razorpayInstance = new Razorpay({
      key_id: honoEnv.RAZORPAY_KEYID,
      key_secret: honoEnv.RAZORPAY_KEYSECRET,
    });

    const { amount, credits } = checkPlan(planId);
    const primaryKey = ulid();

    const res = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: primaryKey,
      notes: {
        userId: user.id,
        planId,
        amount,
        credits,
        internalOrderId: primaryKey,
      },
    });

    await insertPayment({
      id: primaryKey,
      userId: user.id,
      amount,
      pgRefId: res.id,
      status: "pending",
    });

    return c.json(
      { pgOrderId: res.id, internalOrderId: primaryKey },
      200,
      awsHeaders
    );
  } catch (error) {
    console.error(error);
    return c.json({ message: "Payment failed" }, 500, awsHeaders);
  }
};

export const instamojoTokenResSchema = z.object({
  access_token: z.string({ message: "Instamojo access token not found" }),
  token_type: z.string({ message: "Instamojo token type not found" }),
  expires_in: z.number({ message: "Instamojo token expiry not found" }),
  scope: z.string({ message: "Instamojo token scope not found" }),
});

export const razorpayWeebhookHandler: AppRouteHandler<
  TRazorpayWeebhookRoute
> = async (c) => {
  try {
    console.log("Webhook called");
    const signature = createHmac("sha256", secretKey);

    const body = await c.req.json();
    signature.update(JSON.stringify(body));
    const digest = signature.digest("hex");
    console.log("Checking signature against X-Razorpay-Signature header");

    if (digest !== c.req.header("X-Razorpay-Signature")) {
      console.log("Invalid signature");
      return c.json({ message: "Invalid signature" }, 400, awsHeaders);
    }
    console.log(body.payload.payment.entity);

    const orderId: string = body.payload.payment.entity.order_id;
    const status: string = body.payload.payment.entity.status;

    if (!orderId) throw new Error("paymentId not found");

    if (!status) throw new Error("Payment status not found");

    console.log("Initialising db");
    const db = await initialiseDB();

    console.log("Checking payment status:", status);

    if (status === "authorized" || status === "captured") {
      const payment = await checkPaymentStatus({
        db,
        orderId,
      });
      if (!payment)
        return c.json(
          { message: `Payment with razorpay order_id: ${orderId} not found` },
          400,
          awsHeaders
        );

      if (payment.status === "success")
        return c.json(
          {
            message: `Payment with razorpay order_id: ${orderId} has already been updated`,
          },
          200,
          awsHeaders
        );
      await updatePaymentStatus({
        db,
        paymntStatus: "success",
        referenceId: orderId,
        method: body.payload.payment.entity.method,
        json: body,
      });
      //console.log("Payment status updated");
      // Send the credits to the user
      //console.log("Updating credits");

      await updateCredit({
        db,
        paymentRefId: payment.id,
      });
      // Send the email to the user
    } else c.json({ message: "Payment failed" }, 400, awsHeaders);

    return c.json({ message: "Payment successful" }, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal server error" }, 500, awsHeaders);
  }
};

export const paymentDetailsHandler: AppRouteHandler<
  TPaymentInformationRoute
> = async (c) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "User not found" }, 400, awsHeaders);
    }
    const { id } = c.req.param();

    if (!id) {
      return c.json({ message: "Payment id not found" }, 400, awsHeaders);
    }

    const db = await initialiseDB();

    const payment = await db
      .select()
      .from(paymentTable)
      .where(eq(paymentTable.id, id));

    if (payment.length === 0)
      return c.json({ message: "Payment not found" }, 400, awsHeaders);

    if (payment[0].userId !== user.id) {
      return c.json(
        { message: "Payment does not have same user id as user" },
        400,
        awsHeaders
      );
    }

    return c.json({ ...payment[0] }, 200, awsHeaders);
  } catch (error) {
    console.error(error);
    return c.json(
      { message: `Internal server error: ${error}` },
      500,
      awsHeaders
    );
  }
};
