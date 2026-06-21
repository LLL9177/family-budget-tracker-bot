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
import Navigation from "./navigation/navigation";

const i18n = {
  en: {
    title: "Register a new account",
    description:
      "Enter your email, username, and password to create a new account.",

    loginInstead: "Login instead",

    email: "Email",
    username: "Username",
    password: "Password",
    repeatPassword: "Repeat password",

    register: "Register",
    loginWithGoogle: "Login with Google",

    fieldsMissingTitle: "Fields missing",
    fieldsMissingDescription: "Please make sure to fill in every field.",

    passwordDialogDescription:
      "We generated a one-time password for your account. You will need to use this password when logging in to your account in our bot.",
    passwordDialogLabel: "Here's your password:",
  },

  uk: {
    title: "Створіть новий акаунт",
    description:
      "Введіть електронну пошту, ім’я користувача та пароль, щоб створити новий акаунт.",

    loginInstead: "Увійти",

    email: "Електронна пошта",
    username: "Ім’я користувача",
    password: "Пароль",
    repeatPassword: "Повторіть пароль",

    register: "Зареєструватися",
    loginWithGoogle: "Увійти через Google",

    fieldsMissingTitle: "Не всі поля заповнені",
    fieldsMissingDescription: "Будь ласка, заповніть усі поля.",

    passwordDialogDescription:
      "Ми згенерували одноразовий пароль для вашого акаунта. Він знадобиться для входу у ваш акаунт через нашого бота.",
    passwordDialogLabel: "Ваш пароль:",
  },
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { googleAuth, generatedPassword } = useGoogleAuth(
    auth.setAccess,
    () => {}
  );

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  useEffect(() => {
    if (generatedPassword == null) navigate("/en");
  }, [generatedPassword, navigate]);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (!alertRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    if ([email, password, repeatPassword].includes("")) {
      (alertRef.current.querySelector(".title")! as HTMLElement).innerText =
        t.fieldsMissingTitle;
      (alertRef.current.querySelector(".desc")! as HTMLElement).innerText =
        t.fieldsMissingDescription;
      setIsAlertVisible(true);
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 6000);
      return null;
    }

    const res = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
          password,
          repeat_password: repeatPassword,
        }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[#1a191f]">
      <Navigation exclude="Register Page" />
      <form>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
            <CardAction>
              <Link to="/en/login">{t.loginInstead}</Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">{t.email}</label>
              <Input
                required={true}
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="username">{t.username}</label>
              <Input
                required={true}
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">{t.password}</label>
              <Input
                required={true}
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="repeat_password">{t.repeatPassword}</label>
              <Input
                required={true}
                type="password"
                id="repeat_password"
                value={repeatPassword}
                onChange={(e) => {
                  setRepeatPassword(e.target.value);
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button
              className="w-[100%] cursor-pointer"
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {t.register}
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
      <AlertDialog open={generatedPassword !== ""}>
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
