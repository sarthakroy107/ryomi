import { NotFoundHandler } from "hono";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@/lib/app/http-statuses/http-status-phrases";
import { NOT_FOUND } from "@/lib/app/http-statuses/http-status-codes";

export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_MESSAGE} ${c.req.path}`,
    },
    NOT_FOUND
  );
};
