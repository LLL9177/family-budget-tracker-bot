import { Card } from "../ui/card";
import { motion } from "framer-motion";

const i18n = {
  en: {
    sharedBudgets: "Shared family budgets",
    sfbDesk:
      "Create a single family wallet, invite members, and see every transaction in one place.",
    ezTransaction: "Easy transaction tracking",
    ettDesc:
      "Add expenses, incomes, and category labels quickly with a clean dashboard experience.",
    telegramReady: "Telegram-ready",
    trDesc:
      "Use the bot to send payments and receipts from Telegram, then view results in the dashboard.",
  },
  uk: {
    sharedBudgets: "Спільний сімейний бюджет",
    sfbDesk:
      "Створіть один сімейний гаманець, запросіть учасників і переглядайте всі транзакції в одному місці.",
    ezTransaction: "Простий облік транзакцій",
    ettDesc:
      "Швидко додавайте витрати, доходи та категорії у зручному інтерфейсі панелі керування.",
    telegramReady: "Готово для Telegram",
    trDesc:
      "Використовуйте бота, щоб надсилати платежі та чеки в Telegram і одразу бачити їх у дашборді.",
  },
};

export default function Info({ lang }: { lang: "en" | "uk" }) {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-3">
      {[
        {
          title: i18n[lang].sharedBudgets,
          description: i18n[lang].sfbDesk,
        },
        {
          title: i18n[lang].ezTransaction,
          description: i18n[lang].ettDesc,
        },
        {
          title: i18n[lang].ezTransaction,
          description: i18n[lang].trDesc,
        },
      ].map((item) => (
        <motion.div layout initial={{}}>
          <Card
            key={item.title}
            className="h-40 rounded-3xl border bg-card p-6 shadow-sm"
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase dark:text-emerald-400">
                {item.title}
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}
