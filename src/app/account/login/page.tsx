import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="brand-display text-3xl">Sign in</h1>
      <p className="mt-2 text-sm text-stone-600">Access your orders and checkout faster.</p>
      <div className="mt-6 rounded-lg border-2 border-stone-100 bg-white p-6 shadow-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
