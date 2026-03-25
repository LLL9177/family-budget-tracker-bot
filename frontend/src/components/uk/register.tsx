import { useRef, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import ChangeLanguage from "../changeLanguage";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import type { IJwtToken } from "@/types/JwtToken.interface";

type Props = {
  setJwt: (data: IJwtToken) => void;
};

export default function Register_en({ setJwt }: Props) {
  const translations: Record<string, string> = {
    Conflict: "Конфлікт",
    "User with this username already exists":
      "Користувач з таким ім'ям уже існує",
  };

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (!alertRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    if ([email, password, repeatPassword].includes("")) {
      (alertRef.current.querySelector(".title")! as HTMLElement).innerText =
        "Заповнено не всі поля";
      (alertRef.current.querySelector(".desc")! as HTMLElement).innerText =
        "Будь-ласка заповніть всі поля";
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
      }
    );

    const data = await res.json();
    if (data.error) {
      (alertRef.current.querySelector(".title")! as HTMLElement).innerText =
        translations[data.error];
      (alertRef.current.querySelector(".desc")! as HTMLElement).innerText =
        translations[data.message];
      setIsAlertVisible(true);
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 6000);
    } else {
      setJwt(data);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[#1a191f]">
      <ChangeLanguage
        route="/uk/register"
        className="relative top-8 left-45 h-10 w-10"
        iconClass="!w-5 !h-5"
      />
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Зареєструвати аккаунт</CardTitle>
          <CardDescription>
            Введіть вашу електронну адресу, ім'я користувача і пароль щоб
            зареєструвати новий аккаунт
          </CardDescription>
          <CardAction>
            <Link to="/en/login">Увійти в існуючий аккаунт</Link>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Електронна адреса</label>
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
            <label htmlFor="username">Ім'я користувача</label>
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
            <label htmlFor="password">Пароль</label>
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
            <label htmlFor="repeat_password">Повторіть пароль</label>
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
            Зареєструватись
          </Button>
          <Button className="w-[100%] cursor-pointer bg-neutral-300 text-black">
            <img src="/google_logo.png" alt="google" className="h-6" />
            Увійти за допомогою Google
          </Button>
        </CardFooter>
      </Card>
      <Alert
        ref={alertRef}
        className={`ease fixed -bottom-14 w-100 transform transition-all duration-300 ${isAlertVisible ? "opcaity-100 -translate-y-21" : "translate-y-0 opacity-0"}`}
        variant="destructive"
      >
        <AlertTitle className="title"></AlertTitle>
        <AlertDescription className="desc"></AlertDescription>
      </Alert>
    </div>
  );
}
