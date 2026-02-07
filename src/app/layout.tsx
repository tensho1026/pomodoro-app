import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro Log",
  description: "Pomodoroのセット数・時間・メモを日次で記録するアプリ",
};

const hasClerkEnvironment =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {hasClerkEnvironment ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
