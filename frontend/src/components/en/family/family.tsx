import { AuthContext } from "@/contexts/AuthContext";
import type { IFamily } from "@/types/Family.interface";
import { useContext, useEffect, useState } from "react";

export default function Family_en() {
  const auth = useContext(AuthContext);
  const [familyData, setFamilyData] = useState<IFamily>();

  useEffect(() => {
    async function fetchFamilyData() {
      try {
        const data = await fetch(import.meta.env.VITE_BACKEND_URL + "/family", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        }).then((res) => res.json());

        if (data.id) setFamilyData(data);
        else throw new Error(data.error);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFamilyData();
  }, [auth.access]);

  return <div></div>;
}
