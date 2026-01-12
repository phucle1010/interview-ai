import { Suspense } from "react";
import { SignupForm } from "@/modules/auth/components/SignupForm";
import { Loader2 } from "lucide-react";

function SignupLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Loading signup page...</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(253,128,66,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(253,128,66,0.08),transparent_50%)]" />

        {/* Content */}
        <div className="relative z-10 w-full">
          <SignupForm />
        </div>
      </div>
    </Suspense>
  );
}
