import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { IFamily } from "@/types/Family.interface";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation_en from "../niavigation/navigation";

export default function CreateFamily_en() {
  const [family, setFamily] = useState<IFamily>();
  const [name, setName] = useState("");
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const navigate = useNavigate();

  function createFamily(e: React.MouseEvent) {
    e.preventDefault();
    async function fetchData() {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/family/create",
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ name }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!data.ok) console.error(data);
        else navigate("/en");
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  return (
    <div
      className={
        "flex h-[100vh] items-center justify-center" +
        `${currentTheme === "dark" ? " bg-[url('/main-background.png')]" : " bg-[url('/main-background-light.jpg')]"}`
      }
    >
      <Navigation_en />
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Create a family</CardTitle>
          <CardDescription>
            Enter a family name to create a fresh-new family
          </CardDescription>
          <CardAction>
            <Link to="/en/connect_family">Connect to a family instead</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <label htmlFor="name">Family name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button onClick={(e) => createFamily(e)} className="mt-2">
              Create a new family
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
