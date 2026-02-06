import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro Log",
  description: "Pomodoroのセット数・時間・メモを日次で記録するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
