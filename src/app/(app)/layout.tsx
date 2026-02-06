import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { requireCurrentUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireCurrentUser();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
      <AppHeader user={user} />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-6 md:pb-10">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
