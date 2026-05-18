import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useState } from "react";

export default function ConnectFamily_en() {
  const auth = useContext(AuthContext);

  const [familyId, setFamilyId] = useState("");
  const [error, setError] = useState("");

  async function joinFamily() {
    try {
      const data = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/request_to_join/${familyId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        }
      ).then((res) => res.json());

      console.log(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while joining the family");
    }
  }

  function submitFamilyId(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const regexp = new RegExp(
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
    );

    if (!regexp.test(familyId)) {
      setError("Please type in a valid UUID");
      return;
    }

    setError("");
    joinFamily();
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Card className="flex h-[15%] w-[40%] flex-row items-center justify-around">
        <h1 className="text-2xl font-semibold">
          Connect To A Family
        </h1>

        <form className="flex items-center justify-center gap-2">
          <Input
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            id="family-id-input"
            placeholder="Family ID"
          />

          <Button
            onClick={(e) => submitFamilyId(e)}
            className="cursor-pointer"
          >
            Join
          </Button>
        </form>
      </Card>

      <span
        className={`transform text-red-500 transition-all duration-300 ease-out ${
          error
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 pointer-events-none opacity-0"
        }`}
      >
        {error}
      </span>
    </div>
  );
}