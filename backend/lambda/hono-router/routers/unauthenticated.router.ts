import { createRouter } from "@/lib/app/hono-boilerplate/create-app";
import { registerRoute } from "@/lambda/hono-router/routes/register.route";
import { registerUser } from "../handlers/register.handler";
import { loginRoute } from "../routes/login.route";
import { loginHandler } from "../handlers/login.handler";

//**Unauthenticated route handler */

export const router = createRouter()
  .openapi(registerRoute, registerUser)
  .openapi(loginRoute, loginHandler);
