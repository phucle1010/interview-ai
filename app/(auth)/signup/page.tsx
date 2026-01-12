import { Suspense } from "react";
import { SignupForm } from "@/modules/auth/components/SignupForm";

function SignupLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <SignupForm />
      </div>
    </Suspense>
  );
}
