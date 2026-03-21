import i18next from "i18next";
import LanguageDetctor from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
  .use(LanguageDetctor)
  .use(initReactI18next)
  .init({
    lng: "en",
    resources: {
      en: {
        translation: {
          loginToAccount: "Login to your account",
          enterYourUsernameAnd:
            "Enter your username and password below to login to your account",
          signUp: "Sign Up",
          username: "Username",
          password: "Password",
          forgotYourPassword: "Forgot your password?",
          login: "Login",
          loginWithGoogle: "Login with Google",
        },
      },
      uk: {
        translation: {
          loginToAccount: "Вхід в ваш аккаунт",
          enterYourUsernameAnd:
            "Введіть ім'я користувача і пароль щоб ввійти в ваш аккаунт",
          signUp: "Реєстраця",
          username: "Ім'я користувача",
          password: "Пароль",
          forgotYourPassword: "Забули пароль?",
          login: "Увійти",
          loginWithGoogle: "Увійти за допомогою Google",
        },
      },
    },
  });
