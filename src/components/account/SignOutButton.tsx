import { signOut } from "@/lib/auth";

type Props = {
  className?: string;
};

export function SignOutButton({ className }: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}
