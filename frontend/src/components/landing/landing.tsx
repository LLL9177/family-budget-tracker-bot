import { useContext, useState } from "react";
import { Button } from "../ui/button";
import LanguageSelection from "./language-selection";
import Hero from "./hero";
import Info from "./info";
import OtherInfo from "./other-info";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

const i18n = {
  en: {
    register: "Register",
    login: "Log in",
  },
  uk: {
    register: "Реєстрація",
    login: "Увійти",
  },
};

export default function Landing() {
  const [lang, setLang] = useState<"en" | "uk" | null>(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" || saved === "uk" ? saved : null;
  });
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (auth.access) navigate(`/dashboard`);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <nav className="align-center fixed left-[50%] z-1 mt-2 flex w-50 translate-x-[-50%] justify-center px-5 py-1">
        <img
          src="/clearly-not-ai-generated-logo.png"
          className="mr-5 h-10 rounded-full"
        />
        <div className="flex rounded-full border backdrop-blur-lg">
          <Button
            className="h-10 cursor-pointer rounded-full px-3 text-lg"
            onClick={() => navigate(`/register`)}
          >
            {i18n[lang ?? "en"].register}
          </Button>
          <Button
            variant={"link"}
            className="h-10 cursor-pointer text-lg text-foreground"
            onClick={() => navigate(`/login`)}
          >
            {i18n[lang ?? "en"].login}
          </Button>
        </div>
      </nav>
      <Hero lang={lang ?? "en"} />
      <div className="bg-[rgba(113,132,193,0.2)] dark:bg-[rgba(34,45,80,0.5)]">
        <div className="rounded-t-[40px] border bg-card/50">
          <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-8">
            <Info lang={lang ?? "en"} />
            <OtherInfo lang={lang ?? "en"} />
          </main>
        </div>
      </div>

      {!lang && <LanguageSelection setLang={() => setLang} />}
    </div>
  );
}
