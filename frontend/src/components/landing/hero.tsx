import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  lang: "en" | "uk";
};

const i18n = {
  en: {
    badge: "Family budget made simple",
    title:
      "Track spending, manage income, and keep your family finances aligned.",
    description:
      "Build shared budgets, invite family members, and stay in control of monthly expenses from the web or Telegram.",
    startFree: "Start free",
    login: "Login",
  },
  uk: {
    badge: "Сімейний бюджет — просто",
    title:
      "Відстежуйте витрати, керуйте доходами та тримайте сімейні фінанси під контролем.",
    description:
      "Створюйте спільні бюджети, запрошуйте членів родини та контролюйте щомісячні витрати з вебу або Telegram.",
    startFree: "Почати безкоштовно",
    login: "Увійти",
  },
};

export default function Hero({ lang }: Props) {
  const navigate = useNavigate();
  const t = i18n[lang];

  return (
    <header className="shadow-[rgb(0,0,0)]-200 flex h-screen w-screen flex-col gap-8 bg-gradient-to-b to-[rgba(113,132,193,0.2)] p-8 lg:px-50 backdrop-blur-xl md:flex-row md:items-center md:justify-between dark:to-[rgba(34,45,80,0.5)]">
      <div className="space-y-10 lg:p-0 pt-40">
        <span className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary dark:bg-emerald-800 dark:text-emerald-300">
          {t.badge}
        </span>

        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.title}
          </h1>

          <p className="max-w-2xl leading-7 text-gray-500 text-muted-foreground sm:text-lg">
            {t.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <Button
            className="cursor-pointer rounded-full px-6 py-3 text-base"
            onClick={() => navigate(`/${lang}/register`)}
          >
            {t.startFree}
          </Button>

          <Button
            variant={"link"}
            className="cursor-pointer rounded-full px-6 py-3 text-base dark:text-white"
            onClick={() => navigate(`/${lang}/login`)}
          >
            {t.login}
          </Button>
        </div>
      </div>

      <div className="hidden xl:block">
        <img src="/landing-family.png" className="max-h-180 rounded-[100px]" />
      </div>
    </header>
  );
}
