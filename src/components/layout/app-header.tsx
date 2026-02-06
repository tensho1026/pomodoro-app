import Link from "next/link";
import { Clock3, LogOut } from "lucide-react";

import { signOutMockClerkAction } from "@/app/actions/auth";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { Button } from "@/components/ui/button";
import type { AppUser } from "@/lib/auth";

type AppHeaderProps = {
  user: AppUser;
};

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">Pomodoro Log</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </Link>

        <DesktopNav />

        <form action={signOutMockClerkAction}>
          <Button type="submit" variant="outline" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            ログアウト
          </Button>
        </form>
      </div>
    </header>
  );
}
