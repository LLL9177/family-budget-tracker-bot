# Family Budget Tracker Bot

A comprehensive family budget management system with a NestJS backend server and a Telegram bot interface. Track expenses, manage family finances, and monitor monthly budgets across multiple family members—all in one place.

## Overview

This project consists of three main components:

- **Frontend**: A React + TypeScript web application for budget management and visualization
- **Server**: A NestJS REST API for managing families, users, transactions, and authentication
- **Bot**: A Telegram bot (Python) for user-friendly budget tracking and family management

## Features

### Core Features

- 👨‍👩‍👧‍👦 **Family Management** - Create families and manage members
- 💰 **Transaction Tracking** - Log payments and receipts with categories
- 📊 **Monthly Summaries** - View spending patterns and analytics
- 💳 **Multiple Categories** - Groceries, taxes, tech, subscriptions, shopping, jobs, credit, and more
- 🔐 **Secure Authentication** - JWT-based authentication with access/refresh tokens
- 🌍 **Multi-language Support** - English and Ukrainian interface
- 📱 **Telegram Integration** - User-friendly bot for on-the-go tracking
- 👥 **Role-Based Access** - Different permissions for family admins and members
- 🌐 **Web Dashboard** - Modern React-based web interface for budget visualization
- 📈 **Charts & Analytics** - Visual representation of spending trends and patterns

## Project Structure

```
family-budget-tracker-bot/
├── frontend/               # React + TypeScript web application
│   ├── src/
│   │   ├── components/    # React components (UI, language-specific)
│   │   ├── contexts/      # React context (Auth, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/          # Authentication & JWT
│   │   ├── family/        # Family management
│   │   ├── transaction/   # Transaction handling
│   │   ├── user/          # User service
│   │   ├── dtos/          # Data transfer objects
│   │   └── types/         # TypeScript interfaces
│   └── package.json
│
├── bot/                   # Python Telegram bot
│   ├── main.py           # Bot entry point
│   ├── db.py             # Database operations
│   ├── schema.sql        # Database schema
│   └── requirements.txt
│
└── README.md
```

## Prerequisites

- **Node.js** 18+ (for server)
- **Python** 3.9+ (for bot)
- **PostgreSQL** 12+ (for database)
- **Telegram Bot Token** (from @BotFather)

## Installation

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the server directory (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. Configure your environment variables:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=dev
   DB_PASSWORD=dev
   DB_NAME=family_tracker

   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret

   BOT_TOKEN=your_telegram_bot_token
   ```

4. Build and start the server:

   ```bash
   npm run build
   npm run start
   ```

   For development with hot reload:

   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory (copy from `.env.example` if available):

   ```
   VITE_BACKEND_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Bot Setup

1. Navigate to the bot directory:

   ```bash
   cd bot
   ```

2. Create a Python virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the bot directory (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

5. Configure your environment variables:

   ```
   API_TOKEN=your_telegram_bot_token
   DB_FILE=data.db
   SCHEMA_FILE=schema.sql
   BACKEND_URL=http://localhost:3000
   ```

6. Run the bot:
   ```bash
   python main.py
   ```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier

### Server

- `npm run start` - Start the application
- `npm run start:dev` - Start with watch mode
- `npm run start:debug` - Start with debug mode
- `npm run start:prod` - Start production build
- `npm run build` - Compile TypeScript to JavaScript
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint and fix issues
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

### Bot

- `python main.py` - Start the Telegram bot

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/bot/login` - Bot login
- `GET /auth/bot/get_username` - Get bot username
- `GET /auth/profile` - Get user profile

### Family Management

- `POST /family/create` - Create a family
- `POST /family/add_member` - Add family member
- `POST /family/remove_member` - Remove family member

### Transactions

- `POST /transaction/new` - Create new transaction
- `GET /transaction/find` - Find transaction
- `GET /transaction/get_user_transactions` - Get user's transactions
- `GET /transaction/get_family_transactions` - Get family's transactions
- `POST /transaction/edit_category` - Edit transaction category
- `POST /transaction/edit_amount` - Edit transaction amount
- `POST /transaction/delete` - Delete transaction
- `GET /transaction/monthly_summary` - Get monthly summary

## Database Schema

The application uses PostgreSQL with TypeORM on the backend side. Here are its entities:

### Server (PostgreSQL) Entities

- **User** - User accounts with authentication
  - `id` (UUID) - User identifier
  - `username` - Login username
  - `password` - Hashed password
  - `roles` - JSON array of user roles (USER, ADMIN, etc.)
  - `family` - UUID reference to user's family
  - `family_owned` - UUID reference to family owned by user

- **Family** - Family groups for shared budget management
  - `id` (UUID) - Family identifier
  - `name` - Family name
  - `members` - JSON array of member IDs
  - `owner` - Reference to family owner (User)

- **Transaction** - Income and expense records
  - `id` (Number) - Transaction identifier
  - `userId` (String) - ID of user who created transaction
  - `familyId` (UUID) - Associated family identifier
  - `amount` (Number) - Amount (negative for expenses, positive for income)
  - `category` (String) - Transaction category
  - `createdAt` (Date) - Timestamp of transaction creation

- **MonthlySummary** - Aggregated monthly financial data
  - `id` (Number) - Summary identifier
  - `familyId` (UUID) - Associated family identifier
  - `month` (Number) - Month number (1-12)
  - `year` (Number) - Calendar year
  - `totalSpent` (Number) - Total expenses for the month
  - `totalEarned` (Number) - Total income for the month
  - `pnl` (Number) - Profit/Loss (totalEarned - totalSpent)
  - `topCategory` (String) - Category with highest spending
  - `topSpenderId` (UUID) - User with highest expenses
  - `topEarnerId` (UUID) - User with highest income

### Bot (SQLite) Tables

The application uses sqlite3 on the bot side for local data persistence. The schema includes:

- **Users** - User accounts with authentication
- **Families** - Family groups and members
- **Transactions** - Income and expense records
- **JWT Tokens** - Refresh token storage (for bot)

## Technologies Used

### Frontend

- **React** - JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management
- **Google OAuth** - Authentication integration

### Server

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

### Bot

- **pyTelegramBotAPI** - Telegram bot API wrapper
- **Python 3** - Programming language
- **requests** - HTTP library for API calls

## Project Features in Detail

### Authentication System

- Secure JWT-based authentication
- Access and refresh token pairs
- Role-based access control (RBAC)
- Bot-specific authentication endpoints

### Family Management

- Create and manage families
- Add/remove family members
- Track shared budgets and expenses

### Transaction Handling

- Log payments and receipts
- Categorize transactions (groceries, taxes, tech, subscriptions, shopping, jobs, credit, other)
- Edit transaction details after creation
- Monthly summaries and analytics

### Telegram Bot Interface

- User registration and login
- Interactive menu system
- Multi-language support (English, Ukrainian)
- Real-time transaction logging
- Family synchronization
- Monthly budget views

## Development

### Getting Started with All Components

To run the entire project locally:

1. **Start the server** (Terminal 1):

   ```bash
   cd server
   npm install
   npm run start:dev
   ```

2. **Start the frontend** (Terminal 2):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Start the bot** (Terminal 3):
   ```bash
   cd bot
   source .venv/bin/activate  # Create if not exists: python3 -m venv .venv
   pip install -r requirements.txt
   python main.py
   ```

The application will be available at:

- Frontend: `http://localhost:5173`
- Server API: `http://localhost:3000`
- Telegram Bot: Interact via Telegram

### Code Quality

- **ESLint** - Maintain code quality
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **TypeScript** - Type safety

### Running Tests

```bash
# Server tests
npm test                  # Run unit tests
npm run test:watch      # Watch mode
npm run test:cov        # With coverage
npm run test:e2e        # End-to-end tests
```

## Environment Variables

### Server (.env)

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=dev
DB_PASSWORD=dev
DB_NAME=family_tracker

JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

BOT_TOKEN=your_telegram_token
```

### Bot (.env)

```
API_TOKEN=your_telegram_bot_token
DB_FILE=data.db
SCHEMA_FILE=schema.sql
BACKEND_URL=http://localhost:3000
```

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 LLL9177

## Support

For support, please open an issue in the repository or contact the development team.

## Roadmap

- [x] Web dashboard UI
- [ ] Push notifications for transactions
- [ ] Recurring transaction templates
- [ ] Budget goals and alerts
- [ ] Data export (CSV, PDF)
- [ ] Advanced analytics and reports
- [ ] Mobile app integration
- [ ] Dark mode toggle in web UI
- [ ] Transaction search and filtering
- [ ] Family activity log

---

**Happy budgeting! 💰**
