import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useState } from "react";
import Navigation_en from "../navigation/navigation";

export default function ConnectFamily_en() {
  const auth = useContext(AuthContext);

  const [familyId, setFamilyId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  async function joinFamily() {
    try {
      const result = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/family/request_to_join",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ familyId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        }
      );
      if (!result.ok) {
        console.error(result);
      } else {
        setMessage(
          "Join request has been sent to the family owner. Wait until they accept it or reject."
        );
      }
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
    <div
      className={
        "flex h-screen w-screen flex-col items-center justify-center gap-4" +
        `${currentTheme === "dark" ? " bg-[url('/main-background.png')]" : " bg-[url('/main-background-light.jpg')]"}`
      }
    >
      <Navigation_en exclude="Connect Family Page" />
      <Card className="flex h-[15%] w-[40%] flex-row items-center justify-around">
        <h1 className="text-2xl font-semibold">Connect To A Family</h1>

        <form className="flex items-center justify-center gap-2">
          <Input
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            id="family-id-input"
            placeholder="Family ID"
          />

          <Button onClick={(e) => submitFamilyId(e)} className="cursor-pointer">
            Join
          </Button>
        </form>
      </Card>

      {error.length ? (
        <span
          className={`transform text-red-500 transition-all duration-300 ease-out ${
            error.length
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          {error}
        </span>
      ) : (
        <span
          className={`transform text-green-300 transition-all duration-300 ease-out ${message.length ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
