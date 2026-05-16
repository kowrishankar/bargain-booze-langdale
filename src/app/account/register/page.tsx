import { RegisterForm } from "@/components/account/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="brand-display text-3xl">Create account</h1>
      <p className="mt-2 text-sm text-stone-600">We&apos;ll use your details to keep you updated on orders.</p>
      <div className="mt-6 rounded-lg border-2 border-stone-100 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
