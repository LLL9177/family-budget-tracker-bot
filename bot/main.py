import telebot as tb
from dotenv import load_dotenv
import os, sqlite3, threading, datetime, re, uuid, requests, json

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")
DB_FILENAME = os.getenv("DB_FILE")
SCHEMA_FILENAME = os.getenv("SCHEMA_FILE")
BACKEND_URL = os.getenv("BACKEND_URL")

bot = tb.TeleBot((API_TOKEN))

translations = {
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
        "Jan": "Січ",
        "Feb": "Лют",
        "Mar": "Бер",
        "Apr": "Кві",
        "May": "Тра",
        "Jun": "Чер",
        "Jul": "Лип",
        "Aug": "Сер",
        "Sep": "Вер",
        "Oct": "Жов",
        "Nov": "Лис",
        "Dec": "Гру"
    }

def init_db():
    conn = sqlite3.connect(
        DB_FILENAME, 
        detect_types=sqlite3.PARSE_DECLTYPES,
        timeout=5 # sec
    )
    conn.row_factory = sqlite3.Row

    with open(SCHEMA_FILENAME, "r") as f:
        sql_script = f.read()
    conn.executescript(sql_script)

    conn.commit()
    conn.close()

def get_db():
    db = sqlite3.connect(
        DB_FILENAME,
        detect_types=sqlite3.PARSE_DECLTYPES
    )
    db.row_factory = sqlite3.Row
    return db

context = threading.local()

@bot.message_handler(commands=["start"])
def send_welcome(msg):
    text_en = 'Hi! This is a bot that can literally make you better at finance. The point of this bot is to help you understand: where is all your money going?\nAlthough this bot is called "Family Budget Tracker", you can also track your own budget only. About that later, now just choose the language:'
    text_uk = 'Привіт! Це бот який може буквально зробити тебе кращим в фінансах. Ціль цього бота це допомгти тобі зрозуміти: куди всі твою гроші уходять?\nХоч цей бот називається "Family Budget Tracker", що в перекладі "Відстежувач сімйеного бюжджету", ти також можеш відстежувати тільки свій особистий бюджет. Про це пізніше, зараз вибери мову:'

    kb = tb.types.InlineKeyboardMarkup()

    btn1 = tb.types.InlineKeyboardButton(text="English (Англійска)", callback_data="lang_en")
    btn2 = tb.types.InlineKeyboardButton(text="Ukrainian (Українська)", callback_data="lang_uk")

    kb.row(btn1, btn2)

    bot.send_message(msg.chat.id, f"{text_en}\n\n{text_uk}", reply_markup=kb)


def go_back_btn(lang, callback_data):
    if lang == "en":
        return tb.types.InlineKeyboardButton("🔙 Go back", callback_data=f"en {callback_data}")
    else:
        return tb.types.InlineKeyboardButton("🔙 Повернутись назад", callback_data=f"uk {callback_data}")

def validate_date_en(text):
    def match_date(text):
        return re.match(r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$", text) is not None

    if text == "today" or text == "Today":
        return datetime.date.today().isoformat()
    elif match_date(text):
        d = text.split(".")

        for i in range(len(d)):
            d[i] = int(d[i])


        date = datetime.datetime.now(d[2], d[1], d[0])
        return date.isoformat()
    else:
        return False
    
def validate_date_uk(text):
    def match_date(text):
        return re.match(r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$", text) is not None

    if text == "сьогодні" or text == "Сьогодні":
        return datetime.date.today().isoformat()
    elif match_date(text):
        d = text.split(".")

        for i in range(len(d)):
            d[i] = int(d[i])

        date = datetime.datetime.now(d[2], d[1], d[0])
        return date.isoformat()
    else:
        return False






@bot.callback_query_handler(func=lambda call: True)
def callback(call):
    if call.data == "lang_en":
        lang_en(call.message)

    elif call.data == "lang_uk":
        lang_uk(call.message)
    
    elif call.data == "en new_rec":
        en_new_rec(call.message)

    elif call.data == "uk new_rec":
        uk_new_rec(call.message)

    elif call.data == "en rec user_option":
        rec_user_option_en(call.message)

    elif call.data == "uk rec user_option":
        rec_user_option_uk(call.message)

    elif call.data == "en rec job":
        recievement_process_en(call.message, "job")

    elif call.data == "uk rec job":
        recievement_process_uk(call.message, "job")

    elif call.data == "en rec credit":
        recievement_process_en(call.message, "credit")

    elif call.data == "uk rec credit":
        recievement_process_uk(call.message, "credit")

    elif call.data == "en rec other":
        recievement_process_en(call.message, "other")

    elif call.data == "uk rec other":
        recievement_process_uk(call.message, "other")

    elif call.data == "en profile":
        show_user_data_en(call.message, call.from_user)

    elif call.data == "uk profile":
        show_user_data_uk(call.message, call.from_user)

    elif call.data == "en menu":
        main_menu_en(call.message)
    
    elif call.data == "uk menu":
        main_menu_uk(call.message)

    elif call.data == "en settings":
        settings_en(call.message)

    elif call.data == "uk settings":
        settings_uk(call.message)

    elif call.data == "en set_lang":
        settings_uk(call.message)
    
    elif call.data == "uk set_lang":
        settings_en(call.message)

    elif call.data == "en new_pay":
        new_payment_en(call.message)

    elif call.data == "uk new_pay":
        new_payment_uk(call.message)

    elif call.data == "en pay user_option":
        payment_process_en(call.message)

    elif call.data == "uk pay user_option":
        payment_user_option_uk(call.message)

    elif call.data == "en pay groceries":
        payment_process_en(call.message, "groceries")

    elif call.data == "uk pay groceries":
        payment_process_uk(call.message, "groceries")

    elif call.data == "en pay taxes":
        payment_process_en(call.message, "taxes")
    
    elif call.data == "uk pay taxes":
        payment_process_uk(call.message, "taxes")

    elif call.data == "en pay fine":
        payment_process_en(call.message, "fine")

    elif call.data == "uk pay fine":
        payment_process_uk(call.message, "fine")

    elif call.data == "en pay tech":
        payment_process_en(call.message, "tech")

    elif call.data == "uk pay tech":
        payment_process_uk(call.message, "tech")
    
    elif call.data == "en pay onl_sub":
        payment_process_en(call.message, "online_subscription")

    elif call.data == "uk pay onl_sub":
        payment_process_uk(call.message, "online_subscription")

    elif call.data == "en pay shopping":
        payment_process_en(call.message, "shopping")

    elif call.data == "uk pay shopping":
        payment_process_uk(call.message, "shopping")

    elif call.data == "en pay other":
        payment_process_en(call.message, "other")

    elif call.data == "uk pay other":
        payment_process_uk(call.message, "other")

    elif call.data == "en family":
        family_en(call.message, call.from_user)

    elif call.data == "uk family":
        family_uk(call.message, call.from_user)

    elif call.data == "en user":
        user_data_en(call.message, call.from_user)

    elif call.data == "uk user":
        user_data_uk(call.message, call.from_user)






# ======================== BOT INERACTIONS ========================
def user_data_en(msg, user_msg):
    transactions = get_user_data(user_msg.id)
    
    if transactions == 1:
        bot.send_message(msg.chat.id, "Something went wrong")
        m = bot.send_message(msg.chat.id, "Loading...")
        main_menu_en(m)
        return None

    if transactions == []:
        bot.send_message(msg.chat.id, "📭 No transactions yet. Go spend or earn something.")
        return None

    total_pnl = 0
    categories = {}

    # --- Aggregate ---
    for t in transactions:
        amount = t["amount"]
        category = t["category"]

        total_pnl += amount
        categories[category] = categories.get(category, 0) + amount

    # --- Sort categories ---
    top_categories = sorted(categories.items(), key=lambda x: abs(x[1]), reverse=True)

    # --- Format transactions ---
    tx_lines = ""
    for t in transactions[:10]:  # show last 10 (assuming already sorted by date)
        amount = t["amount"]
        category = t["category"]
        created = t["createdAt"]

        # Format date nicely
        try:
            dt = datetime.datetime.fromisoformat(created.replace("Z", ""))
            date_str = dt.strftime("%d %b %H:%M")
        except:
            date_str = created[:16]

        sign = "💸" if amount < 0 else "💰"
        tx_lines += f"{sign} {amount:+} | {category} | {date_str}\n"

    # --- Category summary ---
    cat_lines = ""
    for i, (cat, amount) in enumerate(top_categories[:5]):
        if i == 0:
            cat_lines += f"🥇 <b>{cat}: {amount:+}</b>\n"
        elif i == 1:
            cat_lines += f"🥈 <b>{cat}: {amount:+}</b>\n"
        elif i == 2:
            cat_lines += f"🥉 <b>{cat}: {amount:+}</b>\n"
        else:
            cat_lines += f"{cat}: {amount:+}\n"

    # --- Final message ---
    text = (
        f"📊 <b>Your Stats</b>\n\n"
        f"💰 PnL: {total_pnl:+}\n\n"
        f"🏷 <b>Top Categories:</b>\n{cat_lines or 'No categories'}\n"
        f"🧾 <b>Recent Transactions:</b>\n{tx_lines or 'No transactions'}"
    )

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn("en", "menu"))

    bot.edit_message_text(
        text, msg.chat.id, msg.id, parse_mode="HTML", reply_markup=kb
    )

def user_data_uk(msg, user_msg):
    transactions = get_user_data(user_msg.id)
    
    if transactions == 1:
        bot.send_message(msg.chat.id, "Щось пішло не так")
        m = bot.send_message(msg.chat.id, "Завантаження...")
        main_menu_uk(m)
        return None

    if transactions == []:
        bot.send_message(msg.chat.id, "📭 Ще не немає транзакцій. Йдіть витратьте або заробіть щось.")
        return None

    total_pnl = 0
    categories = {}

    # --- Aggregate ---
    for t in transactions:
        amount = t["amount"]
        category = t["category"]

        total_pnl += amount
        categories[category] = categories.get(category, 0) + amount

    # --- Sort categories ---
    top_categories = sorted(categories.items(), key=lambda x: abs(x[1]), reverse=True)

    # --- Format transactions ---
    tx_lines = ""
    for t in transactions[:10]:  # show last 10 (assuming already sorted by date)
        amount = t["amount"]
        category = t["category"]
        created = t["createdAt"]

        # Format date nicely
        try:
            dt = datetime.datetime.fromisoformat(created.replace("Z", ""))
            month = dt.strftime('%b')
            month_uk = translations.get(month, month)
            date_str = dt.strftime(f"%d {month_uk} %H:%M")
        except:
            date_str = created[:16]

        sign = "💸" if amount < 0 else "💰"
        tx_lines += f"{sign} {amount:+} | {translations[category]} | {date_str}\n"

    # --- Category summary ---
    cat_lines = ""
    for i, (cat, amount) in enumerate(top_categories[:5]):
        if i == 0:
            cat_lines += f"🥇 <b>{translations[cat]}: {amount:+}</b>\n"
        elif i == 1:
            cat_lines += f"🥈 <b>{translations[cat]}: {amount:+}</b>\n"
        elif i == 2:
            cat_lines += f"🥉 <b>{translations[cat]}: {amount:+}</b>\n"
        else:
            cat_lines += f"{translations[cat]}: {amount:+}\n"

    # --- Final message ---
    text = (
        f"📊 <b>Your Stats</b>\n\n"
        f"💰 PnL: {total_pnl:+}\n\n"
        f"🏷 <b>Top Categories:</b>\n{cat_lines or 'Немає категорій'}\n"
        f"🧾 <b>Recent Transactions:</b>\n{tx_lines or 'Немає транзакцій'}"
    )

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn("uk", "menu"))

    bot.edit_message_text(
        text, msg.chat.id, msg.id, parse_mode="HTML", reply_markup=kb
    )

def family_en(msg, user_msg):
    def get_usernames(user_ids):
        usernames = {}
        for uid in user_ids:
            res = requests.get(BACKEND_URL+f"/auth/bot/get_username?username={uid}", json={
                "botToken": os.getenv("BOT_TOKEN")
            })
            usernames[uid] = res.content.decode("utf-8")

        return usernames

    family_data = get_family_data(user_msg.id)
    transactions = json.loads(family_data.content)

    current_pnl = 0
    categories = {}
    members = {}

    # --- Aggregate data ---
    for t in transactions:
        amount = t["amount"]
        category = t["category"]
        user = t["userId"]

        current_pnl += amount
        categories[category] = categories.get(category, 0) + amount
        members[user] = members.get(user, 0) + amount

    # --- Get usernames once ---
    user_ids = list(members.keys())
    usernames = get_usernames(user_ids)  # {id: username}

    def uname(uid):
        return usernames.get(uid, uid[:6])  # fallback if missing

    # --- Split earners / spenders ---
    spenders = [(u, a) for u, a in members.items() if a < 0]
    earners = [(u, a) for u, a in members.items() if a > 0]

    top_spenders = sorted(spenders, key=lambda x: x[1])
    top_earners = sorted(earners, key=lambda x: x[1], reverse=True)

    top_categories_spend = sorted(
        [(c, a) for c, a in categories.items() if a < 0],
        key=lambda x: x[1]
    )
    top_categories_earn = sorted(
        [(c, a) for c, a in categories.items() if a > 0],
        key=lambda x: x[1],
        reverse=True
    )

    # --- Safe tops ---
    top_spender = top_spenders[0] if top_spenders else ("None", 0)
    top_earner = top_earners[0] if top_earners else ("None", 0)

    top_category_spender = top_categories_spend[0] if top_categories_spend else ("None", 0)
    top_category_earner = top_categories_earn[0] if top_categories_earn else ("None", 0)

    # --- Leaderboards ---
    spender_leaderboard = ''
    for i, (user, amount) in enumerate(top_spenders[:10]):
        name = uname(user)
        if i < 3:
            spender_leaderboard += f"\t<i>{name}</i>: {amount}\n"
        else:
            spender_leaderboard += f"\t{name}: {amount}\n"

    earner_leaderboard = ''
    for i, (user, amount) in enumerate(top_earners[:10]):
        name = uname(user)
        if i < 3:
            earner_leaderboard += f"\t<i>{name}</i>: {amount}\n"
        else:
            earner_leaderboard += f"\t{name}: {amount}\n"

    # --- Final text ---
    text = (
        f"📊 <b>Family Monthly Stats</b>\n\n"
        f"💰 Balance Change: {current_pnl}\n\n"
        f"🏆 Top Spender: {uname(top_spender[0])} ({top_spender[1]})\n"
        f"🏆 Top Earner: {uname(top_earner[0])} (+{top_earner[1]})\n\n"
        f"🛒 Most spent on: {top_category_spender[0]} ({top_category_spender[1]})\n"
        f"💸 Most earned from: {top_category_earner[0]} (+{top_category_earner[1]})\n\n"
        f"📉 <b>Spender Leaderboard:</b>\n{spender_leaderboard or 'No spenders'}\n"
        f"📈 <b>Earner Leaderboard:</b>\n{earner_leaderboard or 'No earners'}"
    )

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn("en", "menu"))
    bot.edit_message_text(text, msg.chat.id, msg.id, reply_markup=kb, parse_mode="HTML")

def family_uk(msg, user_msg):
    def get_usernames(user_ids):
        usernames = {}
        for uid in user_ids:
            res = requests.get(BACKEND_URL+f"/auth/bot/get_username?username={uid}", json={
                "botToken": os.getenv("BOT_TOKEN")
            })
            usernames[uid] = res.content.decode("utf-8")

        return usernames

    family_data = get_family_data(user_msg.id)
    transactions = json.loads(family_data.content)

    current_pnl = 0
    categories = {}
    members = {}

    # --- Aggregate data ---
    for t in transactions:
        amount = t["amount"]
        category = t["category"]
        user = t["userId"]

        current_pnl += amount
        categories[category] = categories.get(category, 0) + amount
        members[user] = members.get(user, 0) + amount

    # --- Get usernames once ---
    user_ids = list(members.keys())
    usernames = get_usernames(user_ids)  # {id: username}

    def uname(uid):
        return usernames.get(uid, uid[:6])  # fallback if missing

    # --- Split earners / spenders ---
    spenders = [(u, a) for u, a in members.items() if a < 0]
    earners = [(u, a) for u, a in members.items() if a > 0]

    top_spenders = sorted(spenders, key=lambda x: x[1])
    top_earners = sorted(earners, key=lambda x: x[1], reverse=True)

    top_categories_spend = sorted(
        [(c, a) for c, a in categories.items() if a < 0],
        key=lambda x: x[1]
    )
    top_categories_earn = sorted(
        [(c, a) for c, a in categories.items() if a > 0],
        key=lambda x: x[1],
        reverse=True
    )

    # --- Safe tops ---
    top_spender = top_spenders[0] if top_spenders else ("Немає", 0)
    top_earner = top_earners[0] if top_earners else ("Немає", 0)

    top_category_spender = top_categories_spend[0] if top_categories_spend else ("None", 0)
    top_category_earner = top_categories_earn[0] if top_categories_earn else ("None", 0)

    # --- Leaderboards ---
    spender_leaderboard = ''
    for i, (user, amount) in enumerate(top_spenders[:10]):
        name = uname(user)
        if i < 3:
            spender_leaderboard += f"\t<i>{name}</i>: {amount}\n"
        else:
            spender_leaderboard += f"\t{name}: {amount}\n"

    earner_leaderboard = ''
    for i, (user, amount) in enumerate(top_earners[:10]):
        name = uname(user)
        if i < 3:
            earner_leaderboard += f"\t<i>{name}</i>: {amount}\n"
        else:
            earner_leaderboard += f"\t{name}: {amount}\n"

    # --- Final text ---
    text = (
        f"📊 <b>Місячна Статистика Сім'ї</b>\n\n"
        f"💰 Зміна Балансу: {current_pnl}\n\n"
        f"🏆 Топ Витратників: {uname(top_spender[0])} ({top_spender[1]})\n"
        f"🏆 Топ Заробітник: {uname(top_earner[0])} (+{top_earner[1]})\n\n"
        f"🛒 Найбільш Витрачено На: {translations[top_category_spender[0]]} ({top_category_spender[1]})\n"
        f"💸 Найбільш Зароблено З: {translations[top_category_earner[0]]} (+{top_category_earner[1]})\n\n"
        f"📉 <b>Таблиця Витратників:</b>\n{spender_leaderboard or 'Немає витратників'}\n"
        f"📈 <b>Таблиця Заробітників:</b>\n{earner_leaderboard or 'Немає заробітників'}"
    )

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn("uk", "menu"))
    bot.edit_message_text(text, msg.chat.id, msg.id, reply_markup=kb, parse_mode="HTML")

def payment_user_option_en(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(go_back_btn("en", "new_pay"))

    m = bot.edit_message_text(
        "What did you pay for?",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

    def call(msg):
        payment_process_en(msg, msg.text)
    
    bot.register_next_step_handler(m, call)

def payment_user_option_uk(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(go_back_btn("uk", "new_pay"))

    m = bot.edit_message_text(
        "За що ви заплатили?",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

    def call(msg):
        payment_process_uk(msg, msg.text)
    
    bot.register_next_step_handler(m, call)

def payment_process_en(msg, category):
    amount = 0

    def get_date(msg):
        nonlocal amount
        date = validate_date_en(msg.text)

        if date == False:
            m = bot.send_message(msg.chat.id, "Please send a valid date")
            bot.register_next_step_handler(m, get_date)
            return None
        
        result = payment_process(amount, date, msg.from_user.id, category)
        if amount != 0:
            bot.send_message(msg.chat.id, "Success!")

        m = bot.send_message(msg.chat.id, "Loading...")
        main_menu_en(m)

    def get_amount(msg):
        nonlocal amount
        try:
            amount = int(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, "Please write the valid amount of money (number)")
            bot.register_next_step_handler(m, get_amount)
            return None

        if amount == 0:
            bot.send_message(msg.chat.id, "Cancelling...")
            m = bot.send_message(msg.chat.id, "Loading...")
            main_menu_en(m)
            return None
        else:
            m = bot.send_message(msg.chat.id, 'Type in the date of payment following the pattern: dd.mm.yyyy (or just type "today")')
            bot.register_next_step_handler(m, get_date)

    m = bot.send_message(msg.chat.id, "How much did you pay?")
    bot.register_next_step_handler(m, get_amount)

def payment_process_uk(msg, category):
    amount = 0

    def get_date(msg):
        nonlocal amount
        date = validate_date_uk(msg.text)

        if date == False:
            m = bot.send_message(msg.chat.id, "Будь-ласка напишіть дійсну дату")
            bot.register_next_step_handler(m, get_date)
            return None
        
        result = payment_process(amount, date, msg.from_user.id, category)
        print(type(amount), amount)
        if amount != 0:
            bot.send_message(msg.chat.id, "Успіх!")

        m = bot.send_message(msg.chat.id, "Завантаження...")
        main_menu_uk(m)

    def get_amount(msg):
        nonlocal amount
        try:
            amount = int(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, "Будь-ласка напишіть дісну суму грошей (число)")
            bot.register_next_step_handler(m, get_amount)
            return None

        if amount == 0:
            bot.send_message(msg.chat.id, "Відміна...")
            m = bot.send_message(msg.chat.id, "Завантаження...")
            main_menu_uk(m)
            return None
        else:
            m = bot.send_message(msg.chat.id, 'Напишіть дату нарахування за цим шаблоном: дд.мм.рррр (або просто напишіть "сьогодні")')
            bot.register_next_step_handler(m, get_date)

    m = bot.send_message(msg.chat.id, "Скільки ви заплатили?")
    bot.register_next_step_handler(m, get_amount)

def new_payment_en(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(
        tb.types.InlineKeyboardButton("🧺 Groceries", callback_data="en pay groceries"),
        tb.types.InlineKeyboardButton("🪙 Taxes", callback_data="en pay taxes")
    )

    kb.row(
        tb.types.InlineKeyboardButton("📜 Fine", callback_data="en pay fine"),
        tb.types.InlineKeyboardButton("💻 Tech", callback_data="en pay tech")
    )

    kb.row(
        tb.types.InlineKeyboardButton("💳 Online subscriptions", callback_data="en pay onl_sub"),
        tb.types.InlineKeyboardButton("🛍️ Shopping", callback_data="en pay shopping")
    )

    kb.row(
        tb.types.InlineKeyboardButton("Other", callback_data="en pay other"),
        tb.types.InlineKeyboardButton("✏️ Your option", callback_data="en pay user_option")
    )

    kb.row(go_back_btn("en", "menu"))
    
    bot.edit_message_text(
        "Chose a category:",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

def new_payment_uk(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(
        tb.types.InlineKeyboardButton("🧺 Продукти", callback_data="uk pay groceries"),
        tb.types.InlineKeyboardButton("🪙 Податки", callback_data="uk pay fees")
    )

    kb.row(
        tb.types.InlineKeyboardButton("📜 Штраф", callback_data="uk pay fine"),
        tb.types.InlineKeyboardButton("💻 Техніка", callback_data="uk pay tech")
    )

    kb.row(
        tb.types.InlineKeyboardButton("💳 Онлйан підписки", callback_data="uk pay onl_sub"),
        tb.types.InlineKeyboardButton("🛍️ Покупки", callback_data="uk pay shopping")
    )

    kb.row(
        tb.types.InlineKeyboardButton("Інше", callback_data="uk pay other"),
        tb.types.InlineKeyboardButton("✏️ Ваш варіант", callback_data="uk pay user_option")
    )

    kb.row(go_back_btn("uk", "menu"))
    
    bot.edit_message_text(
        "Виберіть категороію",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

def rec_user_option_en(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(go_back_btn("en", "new_rec"))

    m = bot.edit_message_text(
        "Type in the name of the category.",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

    def get_category(msg):
        recievement_process_en(msg, msg.text)

    bot.register_next_step_handler(m, get_category)

def rec_user_option_uk(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(go_back_btn("uk", "new_rec"))

    m = bot.edit_message_text(
        "Напишіть ім'я категорії.",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

    def get_category(msg):
        recievement_process_uk(msg, msg.text)

    bot.register_next_step_handler(m, get_category)

def settings_en(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(
        tb.types.InlineKeyboardButton("Change language to ukrainian", callback_data="en set_lang")
    )
    kb.row(go_back_btn("en", "menu"))

    bot.edit_message_text(
        "Settings",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

def settings_uk(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(
        tb.types.InlineKeyboardButton("Змінити мову на англійську", callback_data="uk set_lang")
    )
    kb.row(go_back_btn("uk", "menu"))

    bot.edit_message_text(
        "Налаштування",
        msg.chat.id,
        msg.message_id,
        reply_markup=kb
    )

def lang_en(msg):
    bot.edit_message_text(
        "Set language to eng. You can always change it in the options.", 
        msg.chat.id,
        msg.message_id,
    )
    m =  bot.send_message(msg.chat.id, "Let's set up your family id. Just send me it as a message.")
    bot.register_next_step_handler(m, sync_family_en)

def lang_uk(msg):
    bot.edit_message_text(
        "Мова поставлена на українську. Ви завжди можете змінити її в налаштуваннях.",
        msg.chat.id, 
        msg.message_id
    )
    m = bot.send_message(msg.chat.id, "Давайте підключемося через ваш family id. Просто надішліть мені його як повідомлення.")
    bot.register_next_step_handler(m, sync_family_uk)

def en_new_rec(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(
        tb.types.InlineKeyboardButton("💼 Job", callback_data="en rec job"),
        tb.types.InlineKeyboardButton("🧾 Credit", callback_data="en rec credit"),
    )

    kb.row(
        tb.types.InlineKeyboardButton("Other", callback_data="en rec other"),
        tb.types.InlineKeyboardButton("✏️ Your option", callback_data="en rec user_option"),
    )
    kb.row(go_back_btn("en", "menu"))

    bot.edit_message_text(
        "What did you recieve from?",
        msg.chat.id, 
        msg.message_id,
        reply_markup=kb
    )

def uk_new_rec(msg):
    kb = tb.types.InlineKeyboardMarkup()

    kb.row(
        tb.types.InlineKeyboardButton("💼 Робота", callback_data="uk rec job"),
        tb.types.InlineKeyboardButton("🧾 Кредит", callback_data="uk rec credit"),
    )

    kb.row(
        tb.types.InlineKeyboardButton("Інше", callback_data="uk rec other"),
        tb.types.InlineKeyboardButton("✏️ Ваш варіант", callback_data="uk rec user_option"),
    )
    kb.row(go_back_btn("uk", "menu"))

    bot.edit_message_text(
        "З чого ви отримали?",
        msg.chat.id, 
        msg.message_id,
        reply_markup=kb
    )

def main_menu_en(msg):
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(
        tb.types.InlineKeyboardButton("📥 New recievement", callback_data="en new_rec"),
        tb.types.InlineKeyboardButton("📤 New payment", callback_data="en new_pay")
    )
    kb.row(
        tb.types.InlineKeyboardButton("👤 Profile", callback_data="en profile"),
        tb.types.InlineKeyboardButton("⚙️ Settings", callback_data="en settings")
    )
    kb.row(tb.types.InlineKeyboardButton("📊 Family", callback_data="en family"))
    kb.row(tb.types.InlineKeyboardButton("📊 My Stats", callback_data="en user"))

    bot.edit_message_text(
        "Choose an action:", 
        msg.chat.id,
        msg.message_id,
        reply_markup=kb,
    )

def main_menu_uk(msg):
    kb = tb.types.InlineKeyboardMarkup()
    kb.row(
        tb.types.InlineKeyboardButton("📥 Нове зарахування", callback_data="uk new_rec"),
        tb.types.InlineKeyboardButton("📤 Нова сплата", callback_data="uk new_pay")
    )
    kb.row(
        tb.types.InlineKeyboardButton("👤 Профіль", callback_data="uk profile"),
        tb.types.InlineKeyboardButton("⚙️ Налаштування", callback_data="uk settings"),
    )
    kb.row(tb.types.InlineKeyboardButton("📊 Сім'я", callback_data="uk family"))
    kb.row(tb.types.InlineKeyboardButton("📊 Моя Статистика", callback_data="uk user"))

    bot.edit_message_text(
        "Виберіть дію:",
        msg.chat.id,
        msg.message_id,  
        reply_markup=kb
    )

def sync_family_en(msg):
    bot.send_message(msg.chat.id, "Let's login to your account")
    sync_account_en(msg, msg.text)

def sync_family_uk(msg):
    bot.send_message(msg.chat.id, "Давайте зайдемо в ваш аккаунт")
    sync_account_uk(msg, msg.text)

def sync_account_en(msg, family_id):
    def get_password(msg, id, family_id):
        password = msg.text
        result = register_local(family_id, msg.from_user.id, id, password)
        if result == 1:
            bot.send_message(msg.chat.id, "Something went wrong")

        login(msg.from_user.id)

        m = bot.send_message(msg.chat.id, "Downloading...")
        main_menu_en(m)

    def get_id(msg, family_id):
        try:
            id = uuid.UUID(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, "Please send a valid user id")
            bot.register_next_step_handler(m, get_id)
            return None

        m = bot.send_message(msg.chat.id, "Send me your account's password")
        bot.register_next_step_handler(m, get_password, id, family_id)

    m = bot.send_message(msg.chat.id, "Send me your user id")
    bot.register_next_step_handler(m, get_id, family_id)

def sync_account_uk(msg, family_id):
    def get_password(msg, id, family_id):
        password = msg.text
        result = register_local(family_id, msg.from_user.id, id, password)
        if result == 1:
            bot.send_message(msg.chat.id, "Щось пішло не так")

        login(msg.from_user.id)

        m = bot.send_message(msg.chat.id, "Завантаження...")
        main_menu_uk(m)

    def get_id(msg, family_id):
        try:
            id = uuid.UUID(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, "Будь-ласка надішліть дійсний id")
            bot.register_next_step_handler(m, get_id)
            return None

        m = bot.send_message(msg.chat.id, "Напишіть мені пароль твого аккаунта")
        bot.register_next_step_handler(m, get_password, id, family_id)

    m = bot.send_message(msg.chat.id, "Напишіть мені id свого аккаунта")
    bot.register_next_step_handler(m, get_id, family_id)

def show_user_data_en(msg, from_user):
    data = get_user_data(from_user.id)

    if data == False or data == None:
        bot.send_message(msg.chat.id, "Something went wrong")
        return None

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn("en", "menu"))
    profile = f"Here's your profile:\nfamily id: {data["family_id"]}"
    m = bot.edit_message_text(
        profile, 
        msg.chat.id, 
        msg.message_id,
        reply_markup=kb
    )

def show_user_data_uk(msg, from_user):
    data = get_user_data(from_user.id)

    if data == False or data == None:
        bot.send_message(msg.chat.id, "Щось пішло не так")
        return None

    kb = tb.types.InlineKeyboardMarkup()
    kb.row(go_back_btn("uk", "menu"))
    profile = f"Ось ваш профіль:\nfamily id: {data["family_id"]}"
    m = bot.edit_message_text(
        profile, 
        msg.chat.id, 
        msg.message_id,
        reply_markup=kb
    )
    
def recievement_process_en(msg, category):
    amount = 0
    date = ''
    user_id = 0

    def recieved_amount(msg):
        nonlocal user_id
        nonlocal amount
        try:
            amount = int(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, "Please write a valid amount of money (number)")
            bot.register_next_step_handler(m, recieved_amount)
            return None
        
        m = bot.send_message(msg.chat.id, 'Type in the date of recievement following the pattern: dd.mm.yyyy (or just type "today")')
        user_id = msg.from_user.id
        bot.register_next_step_handler(m, recieved_date)

    def recieved_date(msg):
        nonlocal date
        date = validate_date_en(msg.text)

        if date == False:
            m = bot.send_message(msg.chat.id, "Please send a valid date")
            bot.register_next_step_handler(m, recieved_date)
            return None

        result = recievement_process(amount, date, user_id, category)
        if result == False:
            bot.send_message(msg.chat.id, "Something went wrong")
        else:
            bot.send_message(msg.chat.id, "Success!")
        m = bot.send_message(msg.chat.id, "Loading...")
        main_menu_en(m)

    m = bot.send_message(msg.chat.id, "How much did you recieve?")
    bot.register_next_step_handler(m, recieved_amount)

def recievement_process_uk(msg, category):
    amount = 0
    date = ''
    user_id = 0

    def recieved_amount(msg):
        nonlocal user_id
        nonlocal amount
        try:
            amount = int(msg.text)
        except Exception:
            m = bot.send_message(msg.chat.id, "Будь-ласка напишіть дійсну суму грошей (число)")
            bot.register_next_step_handler(m, recieved_amount)
            return None
        
        m = bot.send_message(msg.chat.id, 'Напишіть дату нарахування за цим шаблоном: дд.мм.рррр (або просто напишіть "сьогодні")')
        user_id = msg.from_user.id
        bot.register_next_step_handler(m, recieved_date)

    def recieved_date(msg):
        nonlocal date
        date = validate_date_uk(msg.text)

        if date == False:
            m = bot.send_message(msg.chat.id, "Будь-ласка напишіть дісну дату")
            bot.register_next_step_handler(m, recieved_date)
            return None

        result = recievement_process(amount, date, user_id, category)
        if result == False:
            bot.send_message(msg.chat.id, "Щось пішло не так")
        else:
            bot.send_message(msg.chat.id, "Успіх!")
        m = bot.send_message(msg.chat.id, "Завантаження...")
        main_menu_uk(m)

    m = bot.send_message(msg.chat.id, "Скільки ви отримали?")
    bot.register_next_step_handler(m, recieved_amount)    





# ======================== DB PROCESSES ========================
def register_local(family_id, telegram_id, server_uid, password):
    db = get_db()

    try:
        user = db.execute("SELECT * FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()
        
        if not user:
            db.execute(
                "INSERT INTO user (family_id, telegram_id, server_uid, password) VALUES (?, ?, ?, ?)", 
                (str(family_id), telegram_id, str(server_uid), password)
            )
            db.commit()
    except Exception as e:
        print(e)
        db.close()
        return 1
    
    db.close()
    return 0

def login(telegram_id):
    db = get_db()

    try:
        local_user = db.execute("SELECT * FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()
    except Exception as e:
        print(e)
        db.close()
        return 1

    res = requests.post(BACKEND_URL+"/auth/bot/login", {
        "userId": local_user["server_uid"], 
        "password": local_user["password"],
        "botToken": os.getenv("BOT_TOKEN")
    })

    db.close()

    jwt = json.loads(res.content)["access_token"]
    return save_jwt(jwt["access"], jwt["refresh"], telegram_id)

def save_jwt(access, refresh, telegram_id):
    db = get_db()

    try:
        db.execute("UPDATE user SET access = ?, refresh = ? WHERE telegram_id = ?", (access, refresh, telegram_id))
        db.commit()
    except Exception as e:
        print(e)
        db.close()
        return 1
    
    return 0

def get_family_data(telegram_id):
    db = get_db()

    try:
        user = db.execute("SELECT * FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()
    except Exception as e:
        print(e)
        db.close()
        return 1

    now = datetime.datetime.now()
    res = fetch(
        f"/transaction/get_family_transactions?family_uuid={user["family_id"]}", 
        {}, 
        telegram_id, 
        "get"
    )
    
    return res

def payment_process(amount, date, telegram_id, category):
    db = get_db()

    print(f"PAYMENT:\n\tamount: {amount}\n\tdate: {date}\n\tcategory: {category}")

    try:
        user = db.execute("SELECT * FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()
    except Exception as e:
        print(e)
        db.close()
        return 1

    res = fetch("/transaction/new", {
        "familyId": user["family_id"],
        "amount": -amount,
        "createdAt": date,
        "category": category,
    }, telegram_id)

    print(res.content)

def recievement_process(recieved_amount, recieved_date, telegram_id, category):
    db = get_db()

    try:
        family_id = db.execute("SELECT family_id FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()["family_id"]
    except Exception as e:
        print(e)
        db.close()
        return False

    db.close()

    res = fetch("/transaction/new", {
        "familyId": family_id,
        "amount": recieved_amount,
        "category": category,
        "createdAt": recieved_date
    }, telegram_id)

    content = json.loads(res.content)
    if content["statusCode"] >= 300: return False

    return content

def get_user_data(telegram_id):
    db = get_db()

    try:
        user_id = db.execute("SELECT server_uid FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()["server_uid"]
    except Exception as e:
        print(e)
        db.close()
        return 1

    res = fetch(
        f"/transaction/get_user_transactions", 
        {}, telegram_id, "get"
    )

    content = json.loads(res.content)
    db.close()
    if type(content) == "object": 
        print(content)
        return 1
    return content

def fetch(url, data, telegram_id, method="post"):
    db = get_db()

    try:
        user = db.execute("SELECT * FROM user WHERE telegram_id = ?", (telegram_id,)).fetchone()
    except Exception as e:
        print(e)
        db.close()
        return 1

    if method == "post":
        res = requests.post(
            BACKEND_URL+url, 
            json=data,
            headers={
                "Authorization": f"Bearer {user["access"]}", 
                "x-refresh-token": user["refresh"]
            },
        )
    elif method == "get":
        res = requests.get(
            BACKEND_URL+url,
            json=data,
            headers={
                "Authorization": f"Bearer {user["access"]}", 
                "x-refresh-token": user["refresh"]
            },
        )

    if "x-access-token" in res.headers:
        try:
            db.execute(
                "UPDATE user SET access = ? WHERE telegram_id = ?", 
                (res.headers["x-access-token"], telegram_id)
            )
            db.commit()
        except Exception as e:
            print(e)
            db.close()
            return 1
    
    db.close()
    return res


bot.infinity_polling()