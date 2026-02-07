import type { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { getEmailFromClerkUser, syncClerkUserToDatabase } from "@/lib/user-sync";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  await syncClerkUserToDatabase(user);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
      <AppHeader userEmail={getEmailFromClerkUser(user)} />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-6 md:pb-10">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
