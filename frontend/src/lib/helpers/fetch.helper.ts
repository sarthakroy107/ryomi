import { env } from "@/envs/client.env";
import { ZodSchema } from "zod";

export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Props<T> =
  | {
      path: string;
      method: "get";
      resValidator?: ZodSchema<T>;
      onSuccess?: (data: T) => void;
      onError?: (error: APIError) => void;
    }
  | {
      path: string;
      method: "post" | "put" | "delete";
      body?: any;
      resValidator?: ZodSchema<T>;
      onSuccess?: (data: T) => void;
      onError?: (error: APIError) => void;
    };

export async function reqHandler<T>(obj: Props<T>): Promise<T> {
  const response: Response = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}${
      // process.env is neccessary for SSR
      obj.path
    }`,
    {
      method: obj.method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body:
        obj.method !== "get" && obj.body ? JSON.stringify(obj.body) : undefined,
    }
  );

  if (!response.ok) {
    const errorData: { message: string } = await response.json();
    console.error(`Error response: ${JSON.stringify(errorData)}`);
    throw new APIError(response.status, errorData.message);
  }
  

  const data = await response.json();

  // If a response validator is provided, parse and validate the data
  if (obj.resValidator) {
    return obj.resValidator.parse(data);
  }

  if (obj.onSuccess) {
    obj.onSuccess(data);
  }

  return data as T;
}
