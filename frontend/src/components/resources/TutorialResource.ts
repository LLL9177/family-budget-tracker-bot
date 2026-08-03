import type {
  ITutorialSection,
  ITutorialSectionPlain,
} from "@/types/TutorialSection.interface";
import {
  Bell,
  ChartLine,
  Copy,
  KeyRound,
  Menu,
  Receipt,
  RefreshCw,
  Send,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";

export const tutorialResource: ITutorialSection[] = [
  {
    id: "open-bot",
    title: (isLangEn: boolean) =>
      isLangEn ? "Open the Telegram bot" : "Відкрийте Telegram-бота",
    description: (isLangEn: boolean) =>
      isLangEn
        ? "You can open the bot directly from the website in just two clicks. This only needs to be done once unless you remove the chat from Telegram."
        : "Ви можете відкрити бота прямо з сайту всього за два кліки. Це потрібно зробити лише один раз, якщо ви не видалите чат із Telegram.",
    blocks: [
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Open the navigation menu" : "Відкрийте меню навігації",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Click the menu button in the top-left corner of the website to reveal the navigation panel."
            : "Натисніть кнопку меню у верхньому лівому куті сайту, щоб відкрити панель навігації.",
        icon: Menu,
      },
      {
        title: (isLangEn: boolean) =>
          isLangEn ? 'Click "Open Bot"' : "Натисніть «Відкрити бота»",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Selecting this option opens your Telegram bot conversation automatically."
            : "Після вибору цієї опції чат із Telegram-ботом відкриється автоматично.",
        icon: Send,
      },
    ],
    tip: (isLangEn: boolean) =>
      isLangEn
        ? "Keep the chat pinned in Telegram if you use the bot frequently. It saves you from searching for it every time."
        : "Якщо ви часто користуєтеся ботом, закріпіть чат у Telegram. Так вам не доведеться щоразу шукати його.",
  },
  {
    id: "family-id",
    title: (isLangEn: boolean) =>
      isLangEn ? "Find Family ID" : "Знайдіть ID сім'ї",
    description: (isLangEn: boolean) =>
      isLangEn
        ? "You can find your Family ID in either the Family page or the Dashboard."
        : "Ви можете знайти ID своєї сім'ї на сторінці «Сім'я» або на головній панелі.",
    blocks: [
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Family page" : "Сторінка «Сім'я»",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "In the family data section, click the Family ID to copy it."
            : "У розділі з інформацією про сім'ю натисніть на ID сім'ї, щоб скопіювати його.",
        icon: Users,
      },
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Dashboard" : "Головна панель",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Look for the Family ID block and click it to copy."
            : "Знайдіть блок із ID сім'ї та натисніть на нього, щоб скопіювати.",
        icon: ChartLine,
      },
    ],
  },
  {
    id: "user-id",
    title: (isLangEn: boolean) =>
      isLangEn ? "Find your User ID" : "Знайдіть свій ID користувача",
    description: (isLangEn: boolean) =>
      isLangEn
        ? "Your User ID identifies you within your family. You'll need it when connecting your Telegram account to the website."
        : "Ваш ID користувача ідентифікує вас у межах сім'ї. Він знадобиться для підключення Telegram-акаунта до сайту.",
    blocks: [
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Open the Profile page" : "Відкрийте сторінку профілю",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Open the navigation menu and select the Profile page."
            : "Відкрийте меню навігації та перейдіть на сторінку профілю.",
        icon: User,
      },
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Copy your User ID" : "Скопіюйте свій ID користувача",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Click your User ID to copy it to your clipboard."
            : "Натисніть на свій ID користувача, щоб скопіювати його.",
        icon: Copy,
      },
    ],
  },
  {
    id: "renew-otp",
    title: (isLangEn: boolean) =>
      isLangEn ? "Renew your login code (OTP)" : "Оновіть код входу (OTP)",
    description: (isLangEn: boolean) =>
      isLangEn
        ? "The OTP is a temporary code used to securely link your Telegram account with the website. Generate a new one whenever you need to connect again."
        : "OTP — це тимчасовий код, який використовується для безпечного підключення Telegram-акаунта до сайту. Створіть новий код, коли потрібно повторно виконати підключення.",
    blocks: [
      {
        title: (isLangEn: boolean) =>
          isLangEn
            ? "Open the Renew OTP page"
            : "Відкрийте сторінку оновлення OTP",
        description: (isLangEn: boolean) =>
          isLangEn
            ? 'Open the navigation menu and select "Renew OTP".'
            : "Відкрийте меню навігації та виберіть «Оновити OTP».",
        icon: RefreshCw,
      },
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Generate a new code" : "Створіть новий код",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Click the button to generate a new login code, then copy it."
            : "Натисніть кнопку, щоб створити новий код входу, а потім скопіюйте його.",
        icon: KeyRound,
      },
    ],
  },
  {
    id: "auth-requests",
    title: (isLangEn: boolean) =>
      isLangEn ? "Review login requests" : "Перегляд запитів на вхід",
    description: (isLangEn: boolean) =>
      isLangEn
        ? "Whenever someone attempts to log in using the Telegram bot, you'll receive a request that must be approved before access is granted."
        : "Коли хтось намагається увійти через Telegram-бота, ви отримаєте запит, який потрібно підтвердити перед наданням доступу.",
    blocks: [
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Open Auth Requests" : "Відкрийте «Запити на вхід»",
        description: (isLangEn: boolean) =>
          isLangEn
            ? 'Open the navigation menu and select "Auth Requests".'
            : "Відкрийте меню навігації та виберіть «Запити на вхід».",
        icon: Bell,
      },
      {
        title: (isLangEn: boolean) =>
          isLangEn
            ? "Approve or reject the request"
            : "Підтвердіть або відхиліть запит",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Click ✔ to approve the login request or ✖ to reject it."
            : "Натисніть ✔, щоб підтвердити запит на вхід, або ✖, щоб відхилити його.",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: "make-transaction",
    title: (isLangEn: boolean) =>
      isLangEn ? "Make a transaction" : "Створіть транзакцію",
    description: (isLangEn: boolean) =>
      isLangEn
        ? "The Telegram bot lets you record incomes and payments without opening the website, making it much faster to keep your budget up to date."
        : "Telegram-бот дозволяє додавати доходи та витрати без відкриття сайту, що значно пришвидшує ведення бюджету.",
    blocks: [
      {
        title: (isLangEn: boolean) =>
          isLangEn ? "Choose the transaction type" : "Виберіть тип транзакції",
        description: (isLangEn: boolean) =>
          isLangEn
            ? 'Select either "New Income" or "New Payment" to begin.'
            : "Виберіть «Новий дохід» або «Нова витрата», щоб розпочати.",
        icon: Wallet,
      },
      {
        title: (isLangEn: boolean) =>
          isLangEn
            ? "Fill in the transaction details"
            : "Заповніть дані транзакції",
        description: (isLangEn: boolean) =>
          isLangEn
            ? "Choose a category, enter the amount, then select the transaction date or use today's date."
            : "Виберіть категорію, введіть суму, а потім вкажіть дату транзакції або залиште сьогоднішню.",
        icon: Receipt,
      },
    ],
  },
];

export function getTutorialSection(
  index: number,
  isLangEn: boolean
): ITutorialSectionPlain {
  const sectionPlain = tutorialResource[index];
  const data: ITutorialSectionPlain = {
    id: sectionPlain.id,
    title: sectionPlain.title(isLangEn),
    blocks: [],
  };

  if (sectionPlain.tip) data.tip = sectionPlain.tip(isLangEn);
  if (sectionPlain.description)
    data.description = sectionPlain.description(isLangEn);

  data.title = sectionPlain.title(isLangEn);
  data.id = sectionPlain.id;

  sectionPlain.blocks.map((block, i) => {
    const description = block.description(isLangEn);
    const title = block.title(isLangEn);

    data.blocks[i] = {
      icon: block.icon,
      title,
      description,
    };
  });

  return data;
}
