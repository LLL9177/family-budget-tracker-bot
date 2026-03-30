import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

export default function Main() {
  const auth = useContext(AuthContext);
  const decodedJwt = auth.access ? jwtDecode(auth.access) : "";
  const navigate = useNavigate();
  const [familyId, setFamilyId] = useState("");

  console.log(auth);

  useEffect(() => {
    if (!auth.access) return;
    const getProfile = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + `/auth/profile`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.access}`,
            },
          }
        ).then((res) => res.json());
        setFamilyId(data.family);
      } catch (err) {
        console.log(err);
      }
    };

    getProfile();
  }, [decodedJwt, auth.access]);

  return (
    <div>
      {familyId == '' || !familyId ? (
        <>
          <h1>Woops!</h1>
          <p>
            Seems like your account doesn't have family id connected. To access
            this page properly, first{" "}
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
