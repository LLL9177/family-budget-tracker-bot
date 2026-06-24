const i18n = {
  en: {
    gettingStarted: "Getting Started",
    title: "Using the Telegram Bot",
    description:
      "This guide explains everything you need to know about using the Family Budget Tracker bot—from opening it for the first time to creating transactions and approving login requests.",

    getStarted: "Get Started",
    jumpToTransactions: "Jump to Transactions",

    telegramBotTitle: "📱 Telegram Bot",
    telegramBotDescription:
      "Record expenses and income directly from Telegram.",

    secureLoginTitle: "🔒 Secure Login",
    secureLoginDescription:
      "Approve every login request before access is granted.",

    quickSetupTitle: "⚡ Quick Setup",
    quickSetupDescription: "Most users can finish the setup in under a minute.",
  },

  uk: {
    gettingStarted: "Початок роботи",
    title: "Використання Telegram-бота",
    description:
      "Цей посібник пояснює все, що потрібно знати про використання бота Family Budget Tracker — від першого відкриття до створення транзакцій і підтвердження запитів на вхід.",

    getStarted: "Почати",
    jumpToTransactions: "Перейти до транзакцій",

    telegramBotTitle: "📱 Telegram-бот",
    telegramBotDescription:
      "Додавайте витрати та доходи безпосередньо через Telegram.",

    secureLoginTitle: "🔒 Безпечний вхід",
    secureLoginDescription:
      "Підтверджуйте кожен запит на вхід перед наданням доступу.",

    quickSetupTitle: "⚡ Швидке налаштування",
    quickSetupDescription:
      "Більшість користувачів завершують налаштування менш ніж за хвилину.",
  },
} as const;

export function BotTutorialHero() {
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  return (
    <section
      className="mb-5 w-[95vw] lg:w-[82vw] rounded-3xl border bg-card dark:bg-card/80 p-8 backdrop-blur-2xl"
      id="#"
    >
      <div className="max-w-3xl">
        <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          {t.gettingStarted}
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {t.title}
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#open-bot"
            className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            {t.getStarted}
          </a>

          <a
            href="#make-transaction"
            className="rounded-lg border px-5 py-3 font-medium transition hover:bg-muted"
          >
            {t.jumpToTransactions}
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">{t.telegramBotTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.telegramBotDescription}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">{t.secureLoginTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.secureLoginDescription}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">{t.quickSetupTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.quickSetupDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
