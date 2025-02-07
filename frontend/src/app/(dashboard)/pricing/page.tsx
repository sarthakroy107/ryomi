"use client";

import { H2Heading } from "@/components/providers/h2-heading";
import { useCallback, useState } from "react";
import { Check, MoveRight } from "lucide-react";
import { useRazorpay } from "@/hooks/use-razorpay";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { GlowCard, GlowCardWrapper } from "@/components/glow-card/glow-card";

export default function PricingPage() {
  return (
    <main className="w-full flex justify-center mb-8 min-h-[75vh]">
      <div className="w-[75%] lg:w-1/2 lg:min-w-[60rem] mt-3">
        <H2Heading>Buy credits</H2Heading>
        <GlowCardWrapper className="w-full grid grid-cols-1 items-center justify-center md:grid-cols-3 gap-4 pt-6">
          {plans.map(({ id, price, credits }) => (
            <PriceCard
              key={id}
              price={price}
              credits={credits}
              topText={`${credits} credits`}
              planId={id}
            />
          ))}
        </GlowCardWrapper>
      </div>
    </main>
  );
}

function PriceCard({
  price,
  credits,
  topText,
  planId,
}: {
  price: number;
  credits: number;
  topText: string;
  planId: string;
}) {
  const router = useRouter();
  const { opernRazorpay } = useRazorpay();
  const [isProcessing, setProcessing] = useState<boolean>();
  const handelPurchase = useCallback(async () => {
    setProcessing(true);
    const { pgOrderId, internalOrderId } = await reqHandler({
      method: "post",
      path: "/payment",
      body: {
        planId,
      },
      resValidator: z.object({
        pgOrderId: z.string(),
        internalOrderId: z.string(),
      }),
    });

    opernRazorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
      amount: ` ${price * 100}`,
      currency: "INR",
      order_id: pgOrderId,
      name: "Ryomi",
      description: `Price:${price}, `,
      image: "https://images7.alphacoders.com/127/1275240.jpg",
      redirect: true,
      handler: async () => {
        router.push("/payment?id=" + internalOrderId);
      },
    });
    setProcessing(false);
  }, []);
  return (
    <GlowCard onClick={handelPurchase}>
      <p className="font-medium text-muted-foreground text-xl mb-6">
        {topText}
      </p>
      <p className="w-fit text-5xl font-extrabold bg-gradient-to-r from-white/40 via-white to-white/60 bg-clip-text text-transparent ">
        ₹{price}
      </p>
      <div className="mt-16 text-sm text-muted-foreground space-y-1">
        <p className="flex items-center gap-x-2">
          {" "}
          <Check className="text-green-300" size={15} /> Best is class UI
        </p>
        <p className="flex items-center gap-x-2">
          {" "}
          <Check className="text-green-300" size={15} /> Transcodes, converts
          and subtitles
        </p>
        <p className="flex items-center gap-x-2">
          {" "}
          <Check className="text-green-300" size={15} /> Cheapest offering in
          the market
        </p>
        <p className="flex items-center gap-x-2">
          {" "}
          <Check className="text-green-300" size={15} /> Creator is not woke
        </p>
      </div>
      <div className="group w-full mt-14 rounded-[3px] font-medium mb-1 flex bg-white/90 text-black justify-center items-center py-2.5 gap-2">
        {isProcessing ? (
          <>
            Processing <MoonLoader size={15} />
          </>
        ) : (
          <>
            Buy
            <MoveRight className="relative px-0 right-0 transition-all" />
          </>
        )}
      </div>
    </GlowCard>
  );
}

const plans: { id: string; price: number; credits: number }[] = [
  { id: "1", price: 50, credits: 100 },
  { id: "2", price: 100, credits: 200 },
  { id: "3", price: 150, credits: 300 },
];
