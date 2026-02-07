import { SignUp } from "@clerk/nextjs";

const hasClerkEnvironment =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export default function SignUpPage() {
  if (!hasClerkEnvironment) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
        <div className="w-full rounded-lg border border-border bg-surface p-6 text-sm text-muted">
          Clerkの環境変数が未設定です。`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` と
          `CLERK_SECRET_KEY` を `.env.local` に設定してください。
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10">
      <SignUp />
    </div>
  );
}
