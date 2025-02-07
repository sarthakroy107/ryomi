import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { Session, User } from "lucia";

export interface AppBindings {
  Bindings: {
    DATABASE_URL: string;
  };

  Variables: {
    user: User | null;
    session: Session | null;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;