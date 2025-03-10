/// <reference types="vite/client" />

import type React from "react";

declare global {
  const React: typeof React;
  interface ImportMetaEnv {
    readonly VITE_STRIPE_PUBLIC_KEY: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
  }

  // Google Analytics gtag
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
    dataLayer: any[];
  }
}
