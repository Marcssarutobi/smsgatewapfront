// src/pages/GoogleCallbackPage.tsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { tokenStorage } from "@/lib/tokenStorage";
import { userService } from "@/services/userService";
import { subscriptionService } from "@/services/subscriptionService";
import { AuthResponse, LoginTwoFactorPendingResponse } from "@/type/user";
import { Icon } from "@iconify/react";
import { PENDING_PLAN_STORAGE_KEY } from "./RegisterPage";

// Même logique que RegisterPage.applyPendingPlanThenRedirect : si un plan avait
// été choisi sur la landing page avant de partir sur Google, on démarre son
// paiement maintenant que le compte est créé/authentifié. Sinon (connexion
// classique, ou inscription sans plan pré-choisi), on va directement au dashboard.
async function applyPendingPlanThenRedirect(navigate: (path: string, opts?: { replace?: boolean }) => void) {
  const pendingPlanId = sessionStorage.getItem(PENDING_PLAN_STORAGE_KEY);
  sessionStorage.removeItem(PENDING_PLAN_STORAGE_KEY);

  if (!pendingPlanId) {
    navigate("/admin", { replace: true });
    return;
  }

  try {
    const data = await subscriptionService.checkout({ plan_id: Number(pendingPlanId) });
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }
  } catch {
    // Ex: Trial gratuit déjà activé à la création du compte Google -> pas une
    // vraie erreur, on continue simplement vers le dashboard.
  }
  navigate("/admin", { replace: true });
}

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
        applyPendingPlanThenRedirect(navigate);
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