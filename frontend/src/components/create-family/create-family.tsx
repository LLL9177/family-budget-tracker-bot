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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../navigation/navigation";

const i18n = {
  en: {
    createFamily: "Create a family",
    createFamilyDescription:
      "Enter a family name to create a brand-new family.",
    connectInstead: "Connect to a family instead",
    familyName: "Family name",
    createNewFamily: "Create a new family",
  },
  uk: {
    createFamily: "Створити сім'ю",
    createFamilyDescription: "Введіть назву сім'ї, щоб створити нову сім'ю.",
    connectInstead: "Натомість приєднатися до сім'ї",
    familyName: "Назва сім'ї",
    createNewFamily: "Створити нову сім'ю",
  },
};

export default function CreateFamily_en() {
  const [name, setName] = useState("");
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const navigate = useNavigate();

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

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
        if (!data.ok) throw new Error(data.statusText);
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
      <Navigation exclude="Create Family Page" />
      <Card className="w-100">
        <CardHeader>
          <CardTitle>{t.createFamily}</CardTitle>
          <CardDescription>{t.createFamilyDescription}</CardDescription>
          <CardAction>
            <Link to="/en/connect_family">{t.connectInstead}</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <label htmlFor="name">{t.familyName}</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button onClick={(e) => createFamily(e)} className="mt-2">
              {t.createNewFamily}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
