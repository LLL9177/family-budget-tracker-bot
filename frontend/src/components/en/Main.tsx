import type { IJwtToken } from "@/types/JwtToken.interface";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Main({ jwt }: { jwt: IJwtToken }) {
  const decodedJwt = jwtDecode(jwt.access_token.access);
  const navigate = useNavigate();
  const [familyId, setFamilyId] = useState("");

  useEffect(() => {
    const getProfile = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + `/auth/profile`,
          {
            method: "POST",
            body: JSON.stringify({
              refresh: jwt.access_token.refresh,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt.access_token.access}`,
            },
          }
        ).then((res) => res.json());
        setFamilyId(data.familyId);
      } catch (err) {
        console.log(err);
      }
    };

    getProfile();
  }, [decodedJwt, jwt.access_token.access, jwt.access_token.refresh]);

  return (
    <div>
      {!familyId ? (
        <>
          <h1>Woops!</h1>
          <p>
            Seems like your account doesn't have family id connected. To access
            this page properly, fist{" "}
            <a onClick={() => navigate("/en/connect_family")}>
              connect family id
            </a>
          </p>
        </>
      ) : (
        <span>dsadasd</span>
      )}
    </div>
  );
}
