import { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { AuthContext } from "@/contexts/AuthContext";
import { useTheme } from "./theme-provider";
import Navigation from "./navigation/navigation";

const i18n = {
  en: {
    title: "Login to your account",
    description:
      "Enter your username or email and password below to log in to your account.",

    registerInstead: "Register instead",

    usernameOrEmail: "Username or email",
    password: "Password",

    forgotPassword: "Forgot your password?",

    login: "Login",
    loginWithGoogle: "Login with Google",

    passwordDialogDescription:
      "We generated a one-time password for your account. You will need to use this password when logging in to your account in our bot.",
    passwordDialogLabel: "Here's your password:",
  },

  uk: {
    title: "Увійдіть у свій акаунт",
    description:
      "Введіть ім’я користувача або електронну пошту та пароль, щоб увійти у свій акаунт.",

    registerInstead: "Зареєструватися",

    usernameOrEmail: "Ім’я користувача або електронна пошта",
    password: "Пароль",

    forgotPassword: "Забули пароль?",

    login: "Увійти",
    loginWithGoogle: "Увійти через Google",

    passwordDialogTitle: "Пароль",
    passwordDialogDescription:
      "Ми згенерували одноразовий пароль для вашого акаунта. Він знадобиться для входу у ваш акаунт через нашого бота.",
    passwordDialogLabel: "Ваш пароль:",
  },
};

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { googleAuth, generatedPassword } = useGoogleAuth(
    auth.setAccess,
    () => {}
  );
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  useEffect(() => {
    if (generatedPassword == null) navigate("/en");
  }, [generatedPassword, navigate]);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (!alertRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const isEmail = /\S+@\S+\.\S+/.test(usernameOrEmail);

    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({
        [isEmail ? "email" : "username"]: usernameOrEmail,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    if (data.error) {
      (alertRef.current.querySelector(".title")! as HTMLElement).innerText =
        data.error;
      (alertRef.current.querySelector(".desc")! as HTMLElement).innerText =
        data.message;
      setIsAlertVisible(true);
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 6000);
    } else {
      auth.setAccess(data.access_token.access);
      navigate("/en");
    }
  }

  return (
    <div
      className={
        "flex min-h-screen flex-col items-center justify-center gap-10 bg-[#1a191f]" +
        `${currentTheme === "dark" ? " bg-[url('/main-background.png')]" : " bg-[url('/main-background-light.jpg')]"}`
      }
    >
      <Navigation exclude="Login Page" />
      <form>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
            <CardAction className="cursor-pointer">
              <Link to="/en/register">{t.registerInstead}</Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <label htmlFor="username-or-email">{t.usernameOrEmail}</label>
            <Input
              required={true}
              id="username-or-email"
              className="mt-2 mb-5"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
              }}
            />
            <div className="flex w-full justify-between">
              <label htmlFor="password">{t.password}</label>
              <label className="cursor-pointer">{t.forgotPassword}</label>
            </div>
            <Input
              required={true}
              type="password"
              id="password"
              className="mt-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button
              className="w-[100%] cursor-pointer"
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {t.login}
            </Button>
            <Button
              type="button"
              className="w-[100%] cursor-pointer bg-neutral-300 text-black"
              onClick={() => googleAuth()}
            >
              <img src="/google_logo.png" alt="google" className="h-6" />
              {t.loginWithGoogle}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <Alert
        ref={alertRef}
        className={`ease fixed -bottom-14 w-100 transform transition-all duration-300 ${isAlertVisible ? "opcaity-100 -translate-y-21" : "translate-y-0 opacity-0"}`}
        variant="destructive"
      >
        <AlertTitle className="title"></AlertTitle>
        <AlertDescription className="desc"></AlertDescription>
      </Alert>
      <AlertDialog
        open={generatedPassword !== "" && generatedPassword !== null}
      >
        <AlertDialogContent className="gap-0">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.password}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {t.passwordDialogDescription}
            <br />
            {t.passwordDialogLabel}
          </AlertDialogDescription>
          <span className="password-span mt-3 mb-5">{generatedPassword}</span>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-white !text-black"
              onClick={() => {
                navigate("/en");
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
