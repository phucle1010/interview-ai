import { Suspense } from "react";
import { LoginForm } from "@/modules/auth/components/LoginForm";

function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginForm />
      </div>
    </Suspense>
  );
}
