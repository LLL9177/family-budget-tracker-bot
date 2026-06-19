import { Button } from "../ui/button";
import { Card } from "../ui/card";
import type React from "react";

type Props = {
  setLang: React.Dispatch<React.SetStateAction<"en" | "uk">>;
};

export default function LanguageSelection({ setLang }: Props) {
  function handleLanguage(language: "en" | "uk") {
    localStorage.setItem("lang", language);
    setLang(language);
    window.location.href = "/";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <Card className="max-w-2xl rounded-3xl p-8 text-foreground shadow-2xl shadow-slate-950/20">
        <div className="space-y-6 text-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase">
              Choose your language
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Language selection
            </h1>
            <p className="mt-2 text-slate-600">
              Select your preferred language to continue. English is the default
              and will keep the app working.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={() => handleLanguage("en")}
              className="cursor-pointer rounded-full px-6 py-3 text-base"
            >
              🇬🇧 English
            </Button>
            <Button
              onClick={() => handleLanguage("uk")}
              variant="outline"
              className="cursor-pointer rounded-full px-6 py-3 text-base"
            >
              🇺🇦 Українська
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
