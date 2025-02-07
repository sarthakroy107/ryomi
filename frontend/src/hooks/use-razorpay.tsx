"use client";

import { useCallback, useEffect } from "react";

interface RazorpaySuccesshandlerArgs {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

export interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler?: (args: RazorpaySuccesshandlerArgs) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: "card" | "netbanking" | "wallet" | "emi" | "upi";
  };
  notes?: object;
  theme?: {
    hide_topbar?: boolean;
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  subscription_id?: string;
  subscription_card_change?: boolean;
  recurring?: boolean;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  timeout?: number;
  remember_customer?: boolean;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: boolean;
  };

  config?: {
    display: {
      language: "en" | "ben" | "hi" | "mar" | "guj" | "tam" | "tel";
    };
  };
}

const opernRazorpay = (options: RazorpayOptions) => {
  if (!(window as any).Razorpay) {
    throw new Error("Razorpay SDK not loaded");
  }

  const instance = new (window as any).Razorpay(options);
  instance.open();
};

const isRazorpayLoaded = () => {
  return "Razorpay" in window;
};

export function useRazorpay() {
  const loadRazorpay = useCallback(() => {
    return new Promise((resolve) => {
      const scriptEle = document.createElement("script");
      scriptEle.src = "https://checkout.razorpay.com/v1/checkout.js";
      scriptEle.onload = () => {
        resolve(true);
      };
      scriptEle.onerror = () => {
        console.error("Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(scriptEle);
    });
  }, []);

  useEffect(() => {
    if (window !== undefined && !isRazorpayLoaded()) {
      (async () => {
        try {
          await loadRazorpay();
        } catch (error) {
          console.error("Failed to load Razorpay script", error);
          throw new Error("Failed to load Razorpay script");
        }
      })();
    }
  }, []);

  return {
    opernRazorpay,
  };
}
