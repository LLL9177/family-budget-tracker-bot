import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef } from "react";

export function useRenewAccess() {
  const { setAccess } = useContext(AuthContext);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function renewAccess() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/renew-access",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setAccess(res.headers.get("x-access-token") ?? '');
      } catch (err) {
        console.error(err);
      }
    }

    renewAccess();
  }, [setAccess]);
}

export default function AuthBootstrap() {
  useRenewAccess();
  return null;
}
