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
import ChangeLanguage from "../changeLanguage";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import type { IJwtToken } from "@/types/JwtToken.interface";

type Props = {
  setJwt: (data: IJwtToken) => void;
};

export default function Login_en({ setJwt }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);

  // TODO FOR THIS ONE: on click of sign up redirect to /register

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (!alertRef.current) return;

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
      setJwt(data);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[#1a191f]">
      <ChangeLanguage
        className="relative top-8 left-45 h-10 w-10"
        iconClass="!w-5 !h-5"
        route="/uk/login"
      />
      <form>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter username and password below to login to your account
            </CardDescription>
            <CardAction className="cursor-pointer">
              <Link to="/en/register">Register instead</Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <label htmlFor="username">Username</label>
            <Input
              required={true}
              id="username"
              className="mt-2 mb-5"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <div className="flex w-full justify-between">
              <label htmlFor="password">Password</label>
              <label className="cursor-pointer">Forgot your password?</label>
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
              className="w-[100%]"
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Login
            </Button>
            <Button className="w-[100%] bg-neutral-300 text-black">
              {/* Please add a google logo into the text somehow */}
              Login with Google
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
    </div>
  );
}
