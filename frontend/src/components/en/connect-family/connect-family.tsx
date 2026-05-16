import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useRef, useState } from "react";

export default function ConnectFamily_en() {
  const auth = useContext(AuthContext);
  const [familyId, setFamilyId] = useState("");
  const errorSpanRef = useRef<HTMLSpanElement>(null);

  function submitFamilyId() {
    const regexp = new RegExp(
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
    );
    if (!regexp.test(familyId)) {
      if (!errorSpanRef.current) return;
      errorSpanRef.current.innerText = "Please type in a vaid UUID";
      errorSpanRef.current.classList.remove("hidden");
    }

    async function joinFamily {
        try {
            const data = await fetch(import.meat.env.VITE_BACKEND_URL+"/")
        } catch (err) {
            console.error(err);
        }
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <Card className="w-[40%] h-[15%] flex-row justify-around items-center">
        <h1 className="text-2xl font-semibold">Connect To A Family</h1>
        <form className="flex justify-center items-center gap-2">
          <Input
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            id="family-id-input"
            placeholder="Family ID"
          />
          <span
            ref={errorSpanRef}
            className="hidden text-[rgb(255,0,0)]"
          ></span>
          <Button type="button" onClick={() => submitFamilyId()} className="cursor-pointer">
            Join
          </Button>
        </form>
      </Card>
    </div>
  );
}
