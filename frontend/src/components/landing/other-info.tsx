import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const i18n = {
  en: {
    everythingNeeds: "Everything your family needs to stay on budget.",
    addMembers:
      "Add members, manage roles, monitor spending trends, and get simple monthly summaries at a glance.",
    launchFaster: "Launch faster",
    readyToManage: "Ready to manage family money together?",
    createConnectFamily:
      "Create or connect to family, then continue to your dashboard for secure budgeting and Telegram automation.",
    instantSync: "Instant family sync",
    createNew: "Create new family",
    expenseAndIncomeAnalytics: "Expense and income analytics",
    familyMemberActivity: "Family member activity",
    secureJwtAuthentication: "Secure JWT authentication",
    fastSetupTelegramIntegration: "Fast setup with Telegram integration",
  },
  uk: {
    everythingNeeds: "Усе, що потрібно вашій сім’ї для контролю бюджету.",
    addMembers:
      "Додавайте учасників, керуйте ролями, відстежуйте витрати та отримуйте прості щомісячні підсумки.",
    launchFaster: "Швидкий старт",
    readyToManage: "Готові керувати сімейними фінансами разом?",
    createConnectFamily:
      "Створіть або приєднайтесь до сім’ї, а потім переходьте в дашборд для безпечного бюджету та Telegram-автоматизації.",
    instantSync: "Миттєва синхронізація сім’ї",
    createNew: "Створити нову сім’ю",
    expenseAndIncomeAnalytics: "Аналітика витрат і доходів",
    familyMemberActivity: "Активність членів родини",
    secureJwtAuthentication: "Безпечна JWT автентифікація",
    fastSetupTelegramIntegration: "Швидке налаштування з інтеграцією Telegram",
  },
};

export default function OtherInfo({ lang }: { lang: "en" | "uk" }) {
  const navigate = useNavigate();

  return (
    <section className="mt-12 grid gap-8 rounded-3xl border bg-card p-8 shadow-xl backdrop-blur-xl lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          {i18n[lang].everythingNeeds}
        </h2>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          {i18n[lang].addMembers}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            i18n[lang].expenseAndIncomeAnalytics,
            i18n[lang].familyMemberActivity,
            i18n[lang].secureJwtAuthentication,
            i18n[lang].fastSetupTelegramIntegration,
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-3xl bg-black/2 p-4 text-sm text-muted-foreground shadow-sm dark:bg-white/2"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-600 p-8 text-white shadow-lg shadow-slate-500/20">
        <div className="space-y-6">
          <p className="text-sm tracking-[0.24em] text-sky-200 uppercase">
            {i18n[lang].launchFaster}
          </p>
          <h3 className="text-2xl font-semibold">{i18n[lang].readyToManage}</h3>
          <p className="text-base leading-7 text-slate-100">
            {i18n[lang].createConnectFamily}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              className="cursor-pointer rounded-full bg-white/95 text-slate-900"
              onClick={() => navigate(`/connect_family`)}
            >
              {i18n[lang].instantSync}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer rounded-full border-white/20 bg-white/2 text-white hover:border-white"
              onClick={() => navigate(`/create_family`)}
            >
              {i18n[lang].createNew}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
