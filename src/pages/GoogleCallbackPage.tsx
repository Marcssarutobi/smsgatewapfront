// src/pages/GoogleCallbackPage.tsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { tokenStorage } from "@/lib/tokenStorage";
import { userService } from "@/services/userService";
import { AuthResponse, LoginTwoFactorPendingResponse } from "@/type/user";
import { Icon } from "@iconify/react";

function isTwoFactorPending(
  data: AuthResponse | LoginTwoFactorPendingResponse
): data is LoginTwoFactorPendingResponse {
  return (data as LoginTwoFactorPendingResponse).requires_2fa === true;
}

export function GoogleCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    const code = params.get("code");

    if (!code || hasRun.current) {
      if (!code) navigate("/login?error=google_auth_failed", { replace: true });
      return;
    }
    hasRun.current = true;

    userService.googleCallback(code)
      .then((data) => {
        if (isTwoFactorPending(data)) {
          navigate(`/2fa?temp_token=${data.temp_token}`, { replace: true });
          return;
        }
        tokenStorage.set(data.token);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        navigate("/admin", { replace: true });
      })
      .catch(() => {
        navigate("/login?error=google_auth_failed", { replace: true });
      });
  }, [params, navigate, queryClient]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Icon icon="ph:spinner-gap" className="size-8 animate-spin text-primary" />
    </div>
  );
}