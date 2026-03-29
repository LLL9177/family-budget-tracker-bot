import type { IJwtToken } from "@/types/JwtToken.interface";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export function useGoogleAuth(
  setJwt: (data: IJwtToken) => void,
  onSuccessFunction?: () => void,
  onErrorFunction?: () => void
) {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const googleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      ).then((res) => res.json());

      const data = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/auth/google_auth",
        {
          method: "POST",
          body: JSON.stringify({
            username: userInfo.name,
            email: userInfo.email,
            googleId: userInfo.sub,
          }),
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      if (data.password) {
        setGeneratedPassword(data.password);
      }
      
      setJwt(data);
      if (onSuccessFunction) onSuccessFunction();
    },
    onError: () => {
      if (onErrorFunction) onErrorFunction();
    },
  });

  return { googleAuth, generatedPassword };
}
