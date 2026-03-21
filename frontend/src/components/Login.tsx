import { useState } from "react";
import { Button } from "./ui/button";
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
import { useTranslation } from "react-i18next";
import ChangeLanguage from "./ChangeLanguage";

export default function Login({ setJwt }) {
  const { t } = useTranslation()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // TODO FOR THIS ONE: on click of sign up redirect to /register

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    setJwt(data);
  }

  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center bg-[#1a191f]">
      <ChangeLanguage />
      <form>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>{t("loginToAccount")}</CardTitle>
            <CardDescription>
              {t("enterYourUsernameAnd")}
            </CardDescription>
            <CardAction className="cursor-pointer">{t("signUp")}</CardAction>
          </CardHeader>
          <CardContent>
            <label htmlFor="username">{t("username")}</label>
            <Input
              id="username"
              className="mt-2 mb-5"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <div className="flex w-full justify-between">
              <label htmlFor="password">{t("password")}</label>
              <label className="cursor-pointer">{t("forgotYourPassword")}</label>
            </div>
            <Input
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
              className="w-[100%]"
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {t("login")}
            </Button>
            <Button className="w-[100%] bg-neutral-300 text-black">
              {t("loginWithGoogle")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
