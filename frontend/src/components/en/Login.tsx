import { useContext, useEffect, useRef, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { AuthContext } from "@/contexts/AuthContext";

export default function Login_en() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { googleAuth, generatedPassword } = useGoogleAuth(
    auth.setAccess,
    () => { }
  );

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
              Enter username or email and password below to login to your
              account
            </CardDescription>
            <CardAction className="cursor-pointer">
              <Link to="/en/register">Register instead</Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <label htmlFor="username-or-email">Username or email</label>
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
              className="w-[100%] cursor-pointer"
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Login
            </Button>
            <Button
              type="button"
              className="w-[100%] cursor-pointer bg-neutral-300 text-black"
              onClick={() => googleAuth()}
            >
              <img src="/google_logo.png" alt="google" className="h-6" />
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
      <AlertDialog
        open={generatedPassword !== "" && generatedPassword !== null}
      >
        <AlertDialogContent className="gap-0">
          <AlertDialogHeader>
            <AlertDialogTitle>Password</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            We generated a one-time password for your account. You will need to use this
            password when logging in to your account in our bot.
            <br />
            Here's your password:
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
