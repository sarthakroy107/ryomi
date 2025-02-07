import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings, AppOpenAPI } from "../../types";
import { defaultHook } from "@/lib/app/hono-boilerplate/default-hook";
import { csrf } from "hono/csrf";
import { notFound } from "@/lib/app/hono-boilerplate/not-found";
import onError from "@/lib/app/hono-boilerplate/on-error";
import { cors } from "hono/cors";

export function createRouter() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
  return app;
}

export function igniteApp() {
  const app = createRouter();

  app.use(csrf());
  app.use(
    cors({
      origin: [
        //!Really fucking important
        "http://localhost:3000",
        "https://d26c4nzqgizlj5.cloudfront.net",
        "https://ryomi.site"
      ],
    })
  );
  app.notFound(notFound);
  app.onError(onError);

  configureOpenAPI(app);

  return app;
}

function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Ryomi",
      version: "0.1.0",
    },
  });
}
