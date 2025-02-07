"use clienit";

import { reqHandler } from "@/lib/helpers/fetch.helper";
import { UserSchema } from "@/lib/zod/genral-purpose/base-schemas.zod";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  const queryObject = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () =>
      reqHandler({
        method: "get",
        path: "/user-profile",
        resValidator: UserSchema,
      }),
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return queryObject;
}
