"use client";

import * as React from "react";
import dynamic from "next/dynamic";
const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

import { ThemeProvider as NextThemesProviderType } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProviderType>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
