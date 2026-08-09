import threading
import telebot as tb
from dotenv import load_dotenv
import os
import datetime
import re
import uuid
import requests
import functools
import uvicorn
import json
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")
DB_FILENAME = os.getenv("DB_FILE")
SCHEMA_FILENAME = os.getenv("SCHEMA_FILE")
BACKEND_URL = os.getenv("BACKEND_URL")

fastapi_app = FastAPI()
bot = tb.TeleBot(API_TOKEN)

# ======================== I18N ========================
i18n = {
    "en": {
        # General
        "cancel_words": ("cancel", "Cancel"),
        "something_wrong": "Something went wrong",
        "loading": "Loading...",
        "canceling": "Canceling...",
        "success": "Success!",
        "not_logged_in": "Seems like you are not logged in.",

        # Language setup
        "lang_set": "Set language to eng. You can always change it in the options.",
        "ask_family_id": "Let's set up your family id. Just send me it as a message.",
        "lets_login": "Let's login to your account",

        # Auth / sync
        "ask_user_id": "Send me your user id",
        "invalid_user_id": "Please send a valid user id",
        "ask_password": "Send me your account\'s password (or write \"Google\" if you authenticated using google)",
        "downloading": "Downloading...",
        "incorrect_credentials": "ID or password is incorrect. Let's try again",
        "google_word": ("Google", "google"),
        "ask_otp": "Send me the one-time password",
        "incorrect_otp": f"Seems like the one-time password is not correct. Maybe it's expired. You can renew it on <code>{os.getenv("FRONTEND_URL")+'/one-time-password/renew'}</code>",
        "await_review": "Wait until the owner of this account reviews your request.",
        "review_accept": "The user has accepted your login request.",
        "review_deny": 'The user has rejected your login request. Type "/start" to try again.',

        # Main menu
        "choose_action": "Choose an action:",
        "btn_new_rec": "📥 New recievement",
        "btn_new_pay": "📤 New payment",
        "btn_profile": "👤 Profile",
        "btn_settings": "⚙️ Settings",
        "btn_family": "📊 Family",
        "btn_my_stats": "📊 My Stats",
        "btn_go_back": "🔙 Go back",

        # Settings
        "settings": "Settings",
        "change_lang_btn": "Change language to ukrainian",

        # New transaction
        "today_word": ("today", "Today"),
        "leave_a_comment": """If you wish, write down a comment for this transaction. If you don't, say "no".""",
        "no_words": ("No", "NO", "no"),

        # New recievement
        "recieved_from": "What did you recieve from?",
        "btn_job": "💼 Job",
        "btn_credit": "🧾 Credit",
        "btn_other": "Other",
        "btn_your_option": "✏️ Your option",
        "ask_category_name": "Type in the name of the category.",
        "how_much_recieved": "How much did you recieve?",
        "invalid_amount": "Please write a valid amount of money (number)",
        "ask_rec_date": 'Type in the date of recievement following the pattern: dd.mm.yyyy (or just type "today")',
        "invalid_date": "Please send a valid date",

        # New payment
        "chose_category": "Chose a category:",
        "btn_groceries": "🧺 Groceries",
        "btn_taxes": "🪙 Taxes",
        "btn_fine": "📜 Fine",
        "btn_tech": "💻 Tech",
        "btn_onl_sub": "💳 Online subscriptions",
        "btn_shopping": "🛍️ Shopping",
        "btn_pay_other": "Other",
        "btn_pay_user_option": "✏️ Your option",
        "what_paid_for": "What did you pay for?",
        "how_much_paid": "How much did you pay?",
        "invalid_pay_amount": "Please write the valid amount of money (number)",
        "ask_pay_date": 'Type in the date of payment following the pattern: dd.mm.yyyy (or just type "today")',

        # Profile
        "your_profile": "Here's your profile:\n",

        # User stats
        "no_transactions": "📭 No transactions yet. Go spend or earn something.",
        "stats_title": "📊 <b>Your Stats</b>",
        "pnl_label": "💰 PnL: {pnl}",
        "top_categories_label": "🏷 <b>Top Categories:</b>",
        "recent_tx_label": "🧾 <b>Recent Transactions:</b>",
        "no_categories": "No categories",
        "no_tx": "No transactions",

        # Family stats
        "family_stats_title": "📊 <b>Family Monthly Stats</b>",
        "balance_change": "💰 Balance Change: {pnl}",
        "top_spender": "🏆 Top Spender: {name} ({amount})",
        "top_earner": "🏆 Top Earner: {name} (+{amount})",
        "most_spent_on": "🛒 Most spent on: {cat} ({amount})",
        "most_earned_from": "💸 Most earned from: {cat} (+{amount})",
        "spender_leaderboard": "📉 <b>Spender Leaderboard:</b>",
        "earner_leaderboard": "📈 <b>Earner Leaderboard:</b>",
        "no_spenders": "No spenders",
        "no_earners": "No earners",
        "none_label": "None",
    },
    "uk": {
        # General
        "cancel_words": ("відміна", "Відміна"),
        "something_wrong": "Щось пішло не так",
        "loading": "Завантаження...",
        "canceling": "Відміна...",
        "success": "Успіх!",
        "not_logged_in": "Схоже що ви не авторизовані",

        # Language setup
        "lang_set": "Мова поставлена на українську. Ви завжди можете змінити її в налаштуваннях.",
        "ask_family_id": "Давайте підключемося через ваш family id. Просто надішліть мені його як повідомлення.",
        "lets_login": "Давайте зайдемо в ваш аккаунт",

        # Auth / sync
        "ask_user_id": "Напишіть мені id свого аккаунта",
        "invalid_user_id": "Будь-ласка надішліть дійсний id",
        "ask_password": "Напишіть мені пароль твого аккаунта (або напишіть \"Google\" якщо ви авторизувались через Google)",
        "downloading": "Завантаження...",
        "incorrect_credentials": "ID або пароль неправильні. Давайте спробуемо ще раз",
        "google_word": ("Google", "google"),
        "ask_otp": "Надішліть мені свій одноразовий пароль",
        "incorrect_otp": f"Схоже, що одноразовий пароль невірний. Можливо термін дії закінчився. Ви можете оновити його на <code>{os.getenv("FRONTEND_URL")+"/one-time-assword/renew"}</code>",
        "await_review": "Зачекайте поки власник цього аккаунту передивиться ваш запит.",
        "review_accept": "Користувач прийняв ваш запит на вхід.",
        "review_deny": 'Користувач відхилив ваш запит на вхід. Напишіть "/start" щоб спробувати знову',

        # Main menu
        "choose_action": "Виберіть дію:",
        "btn_new_rec": "📥 Нове зарахування",
        "btn_new_pay": "📤 Нова сплата",
        "btn_profile": "👤 Профіль",
        "btn_settings": "⚙️ Налаштування",
        "btn_family": "📊 Сім'я",
        "btn_my_stats": "📊 Моя Статистика",
        "btn_go_back": "🔙 Повернутись назад",

        # Settings
        "settings": "Налаштування",
        "change_lang_btn": "Змінити мову на англійську",

        # New transaction
        "today_word": ("сьогодні", "Сьогодні"),
        "leave_a_comment": 'Якщо хочете, можете написати коментарій для цієї транзакції. Якщо ні, скажіть "ні"',
        "no_words": ("Ні", "НІ", "ні"),

        # New recievement
        "recieved_from": "З чого ви отримали?",
        "btn_job": "💼 Робота",
        "btn_credit": "🧾 Кредит",
        "btn_other": "Інше",
        "btn_your_option": "✏️ Ваш варіант",
        "ask_category_name": "Напишіть ім'я категорії.",
        "how_much_recieved": "Скільки ви отримали?",
        "invalid_amount": "Будь-ласка напишіть дійсну суму грошей (число)",
        "ask_rec_date": 'Напишіть дату нарахування за цим шаблоном: дд.мм.рррр (або просто напишіть "сьогодні")',
        "invalid_date": "Будь-ласка напишіть дісну дату",

        # New payment
        "chose_category": "Виберіть категороію",
        "btn_groceries": "🧺 Продукти",
        "btn_taxes": "🪙 Податки",
        "btn_fine": "📜 Штраф",
        "btn_tech": "💻 Техніка",
        "btn_onl_sub": "💳 Онлайн підписки",
        "btn_shopping": "🛍️ Покупки",
        "btn_pay_other": "Інше",
        "btn_pay_user_option": "✏️ Ваш варіант",
        "what_paid_for": "За що ви заплатили?",
        "how_much_paid": "Скільки ви заплатили?",
        "invalid_pay_amount": "Будь-ласка напишіть дісну суму грошей (число)",
        "ask_pay_date": 'Напишіть дату нарахування за цим шаблоном: дд.мм.рррр (або просто напишіть "сьогодні")',

        # Profile
        "your_profile": "Ось ваш профіль:\n",

        # User stats
        "no_transactions": "📭 Ще не немає транзакцій. Йдіть витратьте або заробіть щось.",
        "stats_title": "📊 <b>Ваша статистика</b>",
        "pnl_label": "💰 PnL: {pnl}",
        "top_categories_label": "🏷 <b>Топ категорій:</b>",
        "recent_tx_label": "🧾 <b>Останні транзакції:</b>",
        "no_categories": "Немає категорій",
        "no_tx": "Немає транзакцій",

        # Family stats
        "family_stats_title": "📊 <b>Місячна Статистика Сім'ї</b>",
        "balance_change": "💰 Зміна Балансу: {pnl}",
        "top_spender": "🏆 Топ Витратників: {name} ({amount})",
        "top_earner": "🏆 Топ Заробітник: {name} (+{amount})",
        "most_spent_on": "🛒 Найбільш Витрачено На: {cat} ({amount})",
        "most_earned_from": "💸 Найбільш Зароблено З: {cat} (+{amount})",
        "spender_leaderboard": "📉 <b>Таблиця Витратників:</b>",
        "earner_leaderboard": "📈 <b>Таблиця Заробітників:</b>",
        "no_spenders": "Немає витратників",
        "no_earners": "Немає заробітників",
        "none_label": "Немає",
    }
}

category_translations = {
    "groceries": "продукти",
    "taxes": "податки",
    "fine": "штраф",
    "tech": "техніка",
    "online_subscription": "Онлайн підписки",
    "shopping": "покупки",
    "job": "робота",
    "credit": "кредит",
    "other": "інше",
    "None": "Немає",
}

month_translations = {
    "Jan": "Січ", "Feb": "Лют", "Mar": "Бер", "Apr": "Кві",
    "May": "Тра", "Jun": "Чер", "Jul": "Лип", "Aug": "Сер",
    "Sep": "Вер", "Oct": "Жов", "Nov": "Лис", "Dec": "Гру"
}


# ======================== DECORATOR ========================
def localized(lang):
    """
    Injects t() and lang into the wrapped function.
    Also handles cancel detection (replaces use_cancel).
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(msg, *args, **kwargs):
            # Cancel check
            if msg.text in i18n[lang]["cancel_words"]:
                m = bot.send_message(msg.chat.id, i18n[lang]["canceling"])
                main_menu(m, lang=lang)
                return

            def t(
                key, **fmt): return i18n[lang][key].format(**fmt) if fmt else i18n[lang][key]
            return func(msg, t, lang, *args, **kwargs)
        return wrapper
    return decorator


def t(lang, key, **fmt):
    """Global translate function. Use: t(lang, 'key') or t(lang, 'key', var=val)"""
    s = i18n[lang][key]
    return s.format(**fmt) if fmt else s


# ======================== HELPERS ========================
def go_back_btn(lang, callback_data):
    return tb.types.InlineKeyboardButton(
        i18n[lang]["btn_go_back"],
        callback_data=f"{lang} {callback_data}"
    )


def validate_date(text, lang):
    def match_date(text):
        return re.match(r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$", text) is not None

    if text in i18n[lang]["today_word"]:
        return datetime.date.today().isoformat()
    elif match_date(text):
        d = [int(x) for x in text.split(".")]
        return datetime.datetime(d[2], d[1], d[0]).isoformat()
    else:
        return False


def translate_category(cat, lang):
    if lang == "uk":
        return category_translations.get(cat, cat)
    return cat


def format_date(created, lang):
    try:
        dt = datetime.datetime.fromisoformat(created.replace("Z", ""))
        if lang == "uk":
            month = dt.strftime('%b')
            month_uk = month_translations.get(month, month)
            return dt.strftime(f"%d {month_uk} %H:%M")
        return dt.strftime("%d %b %H:%M")
    except:
        return created[:16]

# ======================== FASTAPI ========================


class RequestResult(BaseModel):
    chat_id: int
    lang: Literal["en", "uk"]
    result: bool


@fastapi_app.post("/review_result")
async def revew_result(data: RequestResult):
    def t(key, **fmt): return i18n[data.lang][key].format(**
                                                          fmt) if fmt else i18n[data.lang][key]
    if not data.result:
        bot.send_message(data.chat_id, t("review_deny"))
        return

    bot.send_message(data.chat_id, t("review_accept"))
    m = bot.send_message(data.chat_id, t("loading"))
    main_menu(m, lang=data.lang)


# ======================== BOT START ========================
@bot.message_handler(commands=["start"])
def send_welcome(msg):
    text_en = 'Hi! This is a bot that can literally make you better at finance. The point of this bot is to help you understand: where is all your money going?\nAlthough this bot is called "Family Budget Tracker", you can also track your own budget only. About that later, now just choose the language:'
    text_uk = 'Привіт! Це бот який може буквально зробити тебе кращим в фінансах. Ціль цього бота це допомгти тобі зрозуміти: куди всі твою гроші уходять?\nХоч цей бот називається "Family Budget Tracker", що в перекладі "Відстежувач сімйеного бюжджету", ти також можеш відстежувати тільки свій особистий бюджет. Про це пізніше, зараз вибери мову:'

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(
        tb.types.InlineKeyboardButton(
            "English (Англійска)", callback_data="lang_en"),
        tb.types.InlineKeyboardButton(
            "Ukrainian (Українська)", callback_data="lang_uk")
    )
    bot.send_message(msg.chat.id, f"{text_en}\n\n{text_uk}", reply_markup=kb)


# ======================== CALLBACK ROUTER ========================
@bot.callback_query_handler(func=lambda call: True)
def callback(call):
    # Split "en new_rec" → lang="en", action="new_rec"
    parts = call.data.split(" ", 1)

    if call.data == "lang_en":
        set_lang(call.message, lang="en")
        return
    elif call.data == "lang_uk":
        set_lang(call.message, lang="uk")
        return

    if len(parts) != 2:
        return

    lang, action = parts

    routes = {
        "new_rec": lambda m: new_rec(m, lang=lang),
        "rec user_option": lambda m: rec_user_option(m, lang=lang),
        "rec job": lambda m: recievement_process(m, "Job", lang=lang),
        "rec credit": lambda m: recievement_process(m, "Credit", lang=lang),
        "rec other": lambda m: recievement_process(m, "Other", lang=lang),
        "profile": lambda m: show_user_data(m, call.from_user, lang=lang),
        "menu": lambda m: main_menu(m, lang=lang),
        "settings": lambda m: settings(m, lang=lang),
        "set_lang": lambda m: settings(m, lang="uk" if lang == "en" else "en"),
        "new_pay": lambda m: new_payment(m, lang=lang),
        "pay user_option": lambda m: payment_user_option(m, lang=lang),
        "pay groceries": lambda m: payment_process(m, "Groceries", lang=lang),
        "pay taxes": lambda m: payment_process(m, "Taxes", lang=lang),
        "pay fine": lambda m: payment_process(m, "Fine", lang=lang),
        "pay tech": lambda m: payment_process(m, "Tech", lang=lang),
        "pay onl_sub": lambda m: payment_process(m, "Online subscription", lang=lang),
        "pay shopping": lambda m: payment_process(m, "Shopping", lang=lang),
        "pay other": lambda m: payment_process(m, "Other", lang=lang),
        "family": lambda m: family(m, call.from_user, lang=lang),
        "user": lambda m: user_data(m, call.from_user, lang=lang),
    }

    handler = routes.get(action)
    if handler:
        handler(call.message)


# ======================== BOT INTERACTIONS ========================
def set_lang(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    bot.edit_message_text(t("lang_set"), msg.chat.id, msg.message_id)
    m = bot.send_message(msg.chat.id, t("ask_family_id"))
    bot.register_next_step_handler(m, sync_family, lang=lang)


def local_reauth(msg, send_first_m=True, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    if send_first_m:
        bot.edit_message_text(t("not_logged_in"), msg.chat.id, msg.message_id)
    m = bot.send_message(msg.chat.id, t("ask_family_id"))
    bot.register_next_step_handler(m, sync_family, lang=lang)


def main_menu(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_new_rec"), callback_data=f"{lang} new_rec"),
        tb.types.InlineKeyboardButton(
            t("btn_new_pay"), callback_data=f"{lang} new_pay")
    )
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_profile"), callback_data=f"{lang} profile"),
        tb.types.InlineKeyboardButton(
            t("btn_settings"), callback_data=f"{lang} settings")
    )
    kb.row(tb.types.InlineKeyboardButton(
        t("btn_family"), callback_data=f"{lang} family"))
    kb.row(tb.types.InlineKeyboardButton(
        t("btn_my_stats"), callback_data=f"{lang} user"))

    bot.edit_message_text(t("choose_action"), msg.chat.id,
                          msg.message_id, reply_markup=kb)


def settings(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    other_lang = "uk" if lang == "en" else "en"
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(tb.types.InlineKeyboardButton(
        t("change_lang_btn"), callback_data=f"{lang} set_lang"))
    kb.row(go_back_btn(lang, "menu"))
    bot.edit_message_text(t("settings"), msg.chat.id,
                          msg.message_id, reply_markup=kb)


def new_rec(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_job"), callback_data=f"{lang} rec job"),
        tb.types.InlineKeyboardButton(
            t("btn_credit"), callback_data=f"{lang} rec credit"),
    )
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_other"), callback_data=f"{lang} rec other"),
        tb.types.InlineKeyboardButton(t("btn_your_option"), callback_data=f"{
                                      lang} rec user_option"),
    )
    kb.row(go_back_btn(lang, "menu"))
    bot.edit_message_text(t("recieved_from"), msg.chat.id,
                          msg.message_id, reply_markup=kb)


def rec_user_option(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn(lang, "new_rec"))
    m = bot.edit_message_text(t("ask_category_name"),
                              msg.chat.id, msg.message_id, reply_markup=kb)
    bot.register_next_step_handler(m, recievement_process, lang=lang)


def recievement_process(msg, category=None, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]

    # If called from rec_user_option, category comes from the message text
    if category is None:
        category = msg.text

    amount = 0
    user_id = 0
    comment = None

    def get_comment(msg):
        nonlocal comment

        if msg.text not in t("no_words"):
            comment = msg.text

        m = bot.send_message(msg.chat.id, t("ask_rec_date"))
        bot.register_next_step_handler(m, get_date)

    def get_amount(msg):
        nonlocal amount, user_id

        if msg.text in t("cancel_words"):
            m = bot.send_message(msg.chat.id, t("canceling"))
            main_menu(m, lang=lang)
            return

        try:
            amount = int(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, t("invalid_amount"))
            bot.register_next_step_handler(m, get_amount)
            return

        if amount <= 0:
            m = bot.send_message(msg.chat.id, t("canceling"))
            main_menu(m, lang=lang)
            return

        user_id = msg.from_user.id
        m = bot.send_message(msg.chat.id, t("leave_a_comment"))
        bot.register_next_step_handler(m, get_comment)

    def get_date(msg):
        if msg.text in t("cancel_words"):
            m = bot.send_message(msg.chat.id, t("canceling"))
            main_menu(m, lang=lang)
            return

        date = validate_date(msg.text, lang)
        if date is False:
            m = bot.send_message(msg.chat.id, t("invalid_date"))
            bot.register_next_step_handler(m, get_date)
            return

        result = recievement_process_db(
            amount, date, user_id, category, comment)
        bot.send_message(msg.chat.id, t("success")
                         if result else t("something_wrong"))
        m = bot.send_message(msg.chat.id, t("loading"))
        main_menu(m, lang=lang)

    m = bot.send_message(msg.chat.id, t("how_much_recieved"))
    bot.register_next_step_handler(m, get_amount)


def new_payment(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_groceries"), callback_data=f"{lang} pay groceries"),
        tb.types.InlineKeyboardButton(
            t("btn_taxes"), callback_data=f"{lang} pay taxes")
    )
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_fine"), callback_data=f"{lang} pay fine"),
        tb.types.InlineKeyboardButton(
            t("btn_tech"), callback_data=f"{lang} pay tech")
    )
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_onl_sub"), callback_data=f"{lang} pay onl_sub"),
        tb.types.InlineKeyboardButton(
            t("btn_shopping"), callback_data=f"{lang} pay shopping")
    )
    kb.row(
        tb.types.InlineKeyboardButton(
            t("btn_pay_other"), callback_data=f"{lang} pay other"),
        tb.types.InlineKeyboardButton(
            t("btn_pay_user_option"), callback_data=f"{lang} pay user_option")
    )
    kb.row(go_back_btn(lang, "menu"))
    bot.edit_message_text(t("chose_category"), msg.chat.id,
                          msg.message_id, reply_markup=kb)


def payment_user_option(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn(lang, "new_pay"))
    m = bot.edit_message_text(
        t("what_paid_for"), msg.chat.id, msg.message_id, reply_markup=kb)
    bot.register_next_step_handler(m, payment_process, lang=lang)


def payment_process(msg, category=None, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]

    if category is None:
        category = msg.text

    amount = 0
    comment = None

    def get_comment(msg):
        nonlocal comment

        if msg.text not in t("no_words"):
            comment = msg.text

        m = bot.send_message(msg.chat.id, t("ask_pay_date"))
        bot.register_next_step_handler(m, get_date)

    def get_amount(msg):
        nonlocal amount

        if msg.text in t("cancel_words"):
            m = bot.send_message(msg.chat.id, t("canceling"))
            main_menu(m, lang=lang)
            return

        try:
            amount = int(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, t("invalid_pay_amount"))
            bot.register_next_step_handler(m, get_amount)
            return

        if amount <= 0:
            bot.send_message(msg.chat.id, t("canceling"))
            m = bot.send_message(msg.chat.id, t("loading"))
            main_menu(m, lang=lang)
            return

        m = bot.send_message(msg.chat.id, t("leave_a_comment"))
        bot.register_next_step_handler(m, get_comment)

    def get_date(msg):
        if msg.text in t("cancel_words"):
            m = bot.send_message(msg.chat.id, t("canceling"))
            main_menu(m, lang=lang)
            return

        date = validate_date(msg.text, lang)
        if date is False:
            m = bot.send_message(msg.chat.id, t("invalid_date"))
            bot.register_next_step_handler(m, get_date)
            return

        res = payment_process_db(
            amount, date, msg.from_user.id, category, comment)
        if not res:
            bot.send_message(msg.chat.id, t("something_wrong"))
            m = bot.send_message(msg.chat.id, t("loading"))
            main_menu(m, lang=lang)
            return None

        if amount != 0:
            bot.send_message(msg.chat.id, t("success"))
        m = bot.send_message(msg.chat.id, t("loading"))
        main_menu(m, lang=lang)

    m = bot.send_message(msg.chat.id, t("how_much_paid"))
    bot.register_next_step_handler(m, get_amount)


def show_user_data(msg, from_user, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    data = get_user_data(from_user.id)

    if data == 1:
        bot.send_message(msg.chat.id, t("something_wrong"))
        m = bot.send_message(msg.chat.id, t("loading"))
        main_menu(m, lang=lang)
        return
    elif data == 404:
        local_reauth(msg, lang=lang)
        return

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn(lang, "menu"))
    roles = json.loads(data["roles"])
    profile = t("your_profile")+f"ID: {data["id"]}\nE-Mail: {
        data["email"]}\nUsername: {data["username"]}\nRoles: {", ".join(roles)}"

    bot.edit_message_text(profile, msg.chat.id,
                          msg.message_id, reply_markup=kb)


def user_data(msg, from_user, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    transactions = get_user_transactions(from_user.id)

    if transactions == 404:
        bot.send_message(msg.chat.id, t("not_logged_in"))
        m = bot.send_message(msg.chat.id, t("loading"))
        local_reauth(m, lang=lang)
        return

    if transactions == 1:
        bot.send_message(msg.chat.id, t("something_wrong"))
        m = bot.send_message(msg.chat.id, t("loading"))
        main_menu(m, lang=lang)
        return

    if transactions == []:
        bot.send_message(msg.chat.id, t("no_transactions"))
        return

    transactions = transactions.json()
    total_pnl = 0
    categories = {}

    for tx in transactions:
        amount = tx["amount"]
        category = tx["category"]
        total_pnl += amount
        categories[category] = categories.get(category, 0) + amount

    top_categories = sorted(
        categories.items(), key=lambda x: abs(x[1]), reverse=True)

    tx_lines = ""
    for tx in transactions[:10]:
        amount = tx["amount"]
        category = translate_category(tx["category"], lang)
        date_str = format_date(tx["createdAt"], lang)
        sign = "💸" if amount < 0 else "💰"
        tx_lines += f"{sign} {amount:+} | {category} | {date_str}\n"

    cat_lines = ""
    medals = ["🥇", "🥈", "🥉"]
    for i, (cat, amount) in enumerate(top_categories[:5]):
        cat = translate_category(cat, lang)
        prefix = medals[i] if i < 3 else ""
        bold = i < 3
        line = f"{prefix} <b>{cat}: {
            amount:+}</b>\n" if bold else f"{cat}: {amount:+}\n"
        cat_lines += line

    text = (
        f"{t('stats_title')}\n\n"
        f"{t('pnl_label', pnl=f'{total_pnl:+}')}\n\n"
        f"{t('top_categories_label')}\n{cat_lines or t('no_categories')}\n"
        f"{t('recent_tx_label')}\n{tx_lines or t('no_tx')}"
    )

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn(lang, "menu"))
    bot.edit_message_text(text, msg.chat.id, msg.id,
                          parse_mode="HTML", reply_markup=kb)


def family(msg, from_user, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]

    family_data = get_family_data(from_user.id)

    if family_data == 404:
        bot.send_message(msg.chat.id, t("not_logged_in"))
        m = bot.send_message(msg.chat.id, t("loading"))
        sync_family(m, lang=lang)
        return

    transactions = family_data.json()
    current_pnl = 0
    categories = {}
    members = {}
    usernames = {}

    for tx in transactions:
        amount = tx["amount"]
        category = tx["category"]
        user_id = tx["user"]["id"]
        username = tx["user"]["username"]
        current_pnl += amount
        categories[category] = categories.get(category, 0) + amount
        members[user_id] = members.get(user_id, 0) + amount
        usernames[user_id] = username[:20] + \
            "..." if len(username) > 20 else username

    spenders = [[u, a] for u, a in members.items() if a < 0]
    earners = [[u, a] for u, a in members.items() if a > 0]

    top_spenders = sorted(spenders, key=lambda x: x[1])
    top_earners = sorted(earners,  key=lambda x: x[1], reverse=True)

    top_categories_spend = sorted(
        [[c, a] for c, a in categories.items() if a < 0], key=lambda x: x[1])
    top_categories_earn = sorted(
        [[c, a] for c, a in categories.items() if a > 0], key=lambda x: x[1], reverse=True)

    none_label = t("none_label")
    top_spender = top_spenders[0] if top_spenders else [none_label, 0]
    top_earner = top_earners[0] if top_earners else [none_label, 0]
    top_category_spender = top_categories_spend[0] if top_categories_spend else [
        none_label, 0]
    top_category_earner = top_categories_earn[0] if top_categories_earn else [
        none_label, 0]

    top_category_spender[0] = translate_category(top_category_spender[0], lang)
    top_category_earner[0] = translate_category(top_category_earner[0],  lang)

    spender_leaderboard = ""
    for i, (user, amount) in enumerate(top_spenders[:10]):
        name = usernames.get(user, user[:6])
        if i < 3:
            spender_leaderboard += f"\t<i>{name}</i>: {amount}\n"
        else:
            spender_leaderboard += f"\t{name}: {amount}\n"

    earner_leaderboard = ""
    for i, (user, amount) in enumerate(top_earners[:10]):
        name = usernames.get(user, user[:6])
        if i < 3:
            earner_leaderboard += f"\t<i>{name}</i>: {amount}\n"
        else:
            earner_leaderboard += f"\t{name}: {amount}\n"

    text = (
        f"{t('family_stats_title')}\n\n"
        f"{t('balance_change', pnl=current_pnl)}\n\n"
        f"{t('top_spender', name=usernames.get(
            top_spender[0], top_spender[0][:6]), amount=top_spender[1])}\n"
        f"{t('top_earner',  name=usernames.get(
            top_earner[0],  top_earner[0][:6]),  amount=top_earner[1])}\n\n"
        f"{t('most_spent_on',
             cat=top_category_spender[0], amount=top_category_spender[1])}\n"
        f"{t('most_earned_from',
             cat=top_category_earner[0],  amount=top_category_earner[1])}\n\n"
        f"{t('spender_leaderboard')}\n{
            spender_leaderboard or t('no_spenders')}\n"
        f"{t('earner_leaderboard')}\n{earner_leaderboard or t('no_earners')}"
    )

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn(lang, "menu"))
    bot.edit_message_text(text, msg.chat.id, msg.id,
                          reply_markup=kb, parse_mode="HTML")


def sync_family(msg, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]
    bot.send_message(msg.chat.id, t("lets_login"))
    sync_account(msg, msg.text, lang=lang)


def sync_account(msg, family_id, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]

    def get_password(msg, id, family_id):
        if msg.text in t("google_word"):
            google_auth(msg, family_id, id, lang=lang)
            return

        password = msg.text
        login_result = login(msg.from_user.id, password,
                             msg.from_user.username, id, msg.chat.id, lang)

        if login_result == 401 or login_result == 404:
            bot.send_message(msg.chat.id, t("incorrect_credentials"))
            m = bot.send_message(msg.chat.id, t("loading"))
            local_reauth(m, False, lang=lang)
            return

        m = bot.send_message(msg.chat.id, t("await_review"))

    def get_id(msg, family_id):
        try:
            id = uuid.UUID(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, t("invalid_user_id"))
            bot.register_next_step_handler(m, get_id, family_id)
            return
        m = bot.send_message(msg.chat.id, t("ask_password"))
        bot.register_next_step_handler(m, get_password, id, family_id)

    m = bot.send_message(msg.chat.id, t("ask_user_id"))
    bot.register_next_step_handler(m, get_id, family_id)


def google_auth(msg, family_id, user_id, *, lang):
    def t(key, **fmt): return i18n[lang][key].format(**
                                                     fmt) if fmt else i18n[lang][key]

    def get_otp(msg, user_id, *, lang):
        otp = msg.text
        telegram_id = msg.from_user.id

        res = login_google(
            telegram_id, otp, msg.from_user.username, user_id, msg.chat.id, lang)

        if res == 404:
            bot.send_message(msg.chat.id, t("something_wrong"))
            local_reauth(msg, lang=lang, send_first_m=False)
            return

        if res == 400:
            bot.send_message(msg.chat.id, t(
                "incorrect_otp"), parse_mode="HTML")
            local_reauth(msg, lang=lang, send_first_m=False)
            return

        bot.send_message(msg.chat.id, t("await_review"))

    m = bot.send_message(msg.chat.id, t("ask_otp"))
    bot.register_next_step_handler(m, get_otp, family_id, user_id, lang=lang)


# ======================== DB AND REQUESTS ========================
def login(telegram_id, password, t_username, id, chat_id, lang):
    res = fetch("/auth/bot/login", {
        "telegramId": telegram_id,
        "telegramUsername": t_username,
        "userId": str(id),
        "password": password,
        "chatId": chat_id,
        "lang": lang
    })

    return res.status_code


def login_google(telegram_id, otp, telegram_username, user_id, chat_id, lang):
    res = fetch("/auth/bot/google", {
        "oneTimePassword": otp,
        "telegramId": telegram_id,
        "telegramUsername": telegram_username,
        "userId": str(user_id),
        "chatId": str(chat_id),
        "lang": lang
    })

    return res.status_code


def get_family_data(telegram_id):
    res = fetch(
        f"/transaction/bot/get_family_transactions?telegram_id={telegram_id}",
        {}, "get"
    )
    return res


def payment_process_db(amount, date, telegram_id, category, comment):
    res = fetch("/transaction/new", {
        "telegramId": telegram_id,
        "amount": -amount,
        "createdAt": date,
        "category": category,
        "comment": comment
    })

    return res.status_code == 201


def recievement_process_db(
    recieved_amount, recieved_date, telegram_id, category, comment
):
    res = fetch("/transaction/new", {
        "telegramId": telegram_id,
        "amount": recieved_amount,
        "category": category,
        "createdAt": recieved_date,
        "comment": comment
    })
    if (res.status_code != 201):
        return False

    return "success"


def get_user_data(telegram_id):
    res = fetch(
        f"/auth/bot/profile?telegram_id={telegram_id}", {}, "get").json()
    if type(res) == "object":
        return 1

    return res


def get_user_transactions(telegram_id):
    return fetch(
        f"/transaction/bot/get_user_transactions?telegram_id={telegram_id}",
        {},
        "get"
    )


def fetch(url, data, method="post"):
    if method == "post":
        res = requests.post(
            BACKEND_URL + url,
            json={**data},
            headers={
                "x-bot-token": os.getenv("BOT_TOKEN")
            },
        )
    elif method == "get":
        res = requests.get(
            BACKEND_URL + url,
            json={**data},
            headers={
                "x-bot-token": os.getenv("BOT_TOKEN")
            },
        )

    return res


def run_api():
    uvicorn.run(fastapi_app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    threading.Thread(target=run_api, daemon=True).start()
    bot.infinity_polling()
