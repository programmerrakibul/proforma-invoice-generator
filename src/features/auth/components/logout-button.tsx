"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LogoutButtonProps {
  compact?: boolean;
  onLoggedOut?: () => void;
}

export function LogoutButton({
  compact = false,
  onLoggedOut,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);

    try {
      const result = await signOut();

      if (result.error) {
        throw new Error(result.error.message ?? "Unable to log out.");
      }

      onLoggedOut?.();
      toast.success("You have logged out.");
      router.replace("/auth/login");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to log out.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      type="button"
      variant={"destructive"}
      size={compact ? "icon" : "default"}
      aria-label={compact ? "Log out" : undefined}
      title={compact ? "Log out" : undefined}
      disabled={isLoggingOut}
      onClick={handleLogout}
      className={
        compact ? "rounded-full" : "w-full justify-center rounded-full"
      }
    >
      {isLoggingOut ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <LogOut aria-hidden="true" />
      )}
      {!compact ? (isLoggingOut ? "Logging out…" : "Log out") : null}
    </Button>
  );
}
