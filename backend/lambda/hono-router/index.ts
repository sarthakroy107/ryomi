import { handle } from "hono/aws-lambda";
import { router as authenciatedRoutes } from "@/lambda/hono-router/routers/authenthicated.router";
import { router as unauthenticatedRoutesi } from "@/lambda/hono-router/routers/unauthenticated.router";
import { igniteApp } from "@/lib/app/hono-boilerplate/create-app";

const routes = [authenciatedRoutes, unauthenticatedRoutesi];

const app = igniteApp();

app.get("/", (c) =>
  c.json(
    `Hello Hono!| database url:${process.env.DATABASE_URL}, s3 bucket name:${process.env.AWS_S3_BUCKET_NAME}`
  )
);

app.get("/user/demo", (c) => c.json(c.get("user")));

routes.forEach((router) => {
  app.route("/", router);
});

export const handler = handle(app);
