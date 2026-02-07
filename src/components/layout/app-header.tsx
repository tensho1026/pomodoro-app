import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Clock3 } from "lucide-react";

import { DesktopNav } from "@/components/layout/desktop-nav";

type AppHeaderProps = {
  userEmail: string;
};

export function AppHeader({ userEmail }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">Pomodoro Log</p>
            <p className="text-xs text-muted">{userEmail}</p>
          </div>
        </Link>

        <DesktopNav />

        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-9 w-9",
            },
          }}
        />
      </div>
    </header>
  );
}
