import {
  GETObjectWithIdRoute,
  objectUploadGETRoute,
  objectUploadPOSTRoute,
  // objectUploadPUTRoute,
} from "@/lambda/hono-router/routes/upload.route";
import { dashboadHanlder } from "@/lambda/hono-router/handlers/dashboard.handler";
import { createRouter } from "@/lib/app/hono-boilerplate/create-app";
import {
  getObjByIdWithDerivedObjsHandler,
  getPresignedUrlHandler,
  getUploadedFilesHandler,
} from "@/lambda/hono-router/handlers/upload.handler";
// import { confirmFileUploadHandler } from "@/lambda/hono-router/routes/upload/confirm-file-upload.task";
import { operationRoute } from "@/lambda/hono-router/routes/operation.route";
import { operationsHandler } from "@/lambda/hono-router/handlers/operations.handler";
import {
  dashboardRoute,
  userProfileRRoute,
} from "@/lambda/hono-router/routes/user.route";
import {
  GETCreditHistory,
  POSTCreditCalculatorRoute,
} from "@/lambda/hono-router/routes/credit.route";
import {
  GETCreditHistoryHandler,
  POSTCreditCalculatorHandler,
} from "@/lambda/hono-router/handlers/credit.handler";
import { userProfileHandler } from "../handlers/user.handler";
import { logoutRoute } from "../routes/logout.route";
import { logoutHandler } from "../handlers/logout.handler";
import {
  paymentInformationRoute,
  paymentRoute,
  razorpayWeebhookRoute,
} from "../routes/payment.route";
import {
  paymentDetailsHandler,
  paymnetUrlHandler,
  razorpayWeebhookHandler,
} from "../handlers/payment.handler";
import { deleteFileRoute, downlaodRoute } from "../routes/file.route";
import { deleteFileHanlder, downlaodHandler } from "../handlers/file.handler";
import { verifyEmailRoute } from "../routes/verify.route";
import { verifyEmaiiHandler } from "../handlers/verify-email.handler";
import {
  PUTProfileRoute,
  resetPasswordGeneratorRoute,
  resetPasswordRoute,
} from "../routes/profile.route";
import {
  resetPasswordGenerateHandler,
  resetPasswordHandler,
  updateProfileHanlder,
} from "../handlers/profile.helper";

export const router = createRouter()
  .openapi(dashboardRoute, dashboadHanlder)
  .openapi(objectUploadPOSTRoute, getPresignedUrlHandler)
  // .openapi(objectUploadPUTRoute, confirmFileUploadHandler)
  .openapi(operationRoute, operationsHandler)
  .openapi(objectUploadGETRoute, getUploadedFilesHandler)
  .openapi(GETObjectWithIdRoute, getObjByIdWithDerivedObjsHandler)
  .openapi(GETCreditHistory, GETCreditHistoryHandler)
  .openapi(POSTCreditCalculatorRoute, POSTCreditCalculatorHandler)
  .openapi(userProfileRRoute, userProfileHandler)
  .openapi(logoutRoute, logoutHandler)
  .openapi(paymentRoute, paymnetUrlHandler)
  .openapi(razorpayWeebhookRoute, razorpayWeebhookHandler)
  .openapi(paymentInformationRoute, paymentDetailsHandler)
  .openapi(downlaodRoute, downlaodHandler)
  .openapi(deleteFileRoute, deleteFileHanlder)
  .openapi(verifyEmailRoute, verifyEmaiiHandler)
  .openapi(PUTProfileRoute, updateProfileHanlder)
  .openapi(resetPasswordGeneratorRoute, resetPasswordGenerateHandler)
  .openapi(resetPasswordRoute, resetPasswordHandler);
