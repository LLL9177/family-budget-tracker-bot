import { useContext, useRef, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import ChangeLanguage from "../changeLanguage";
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

export default function Register_en() {
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
    () => {
      navigate("/en/");
    }
  );

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (!alertRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    if ([email, password, repeatPassword].includes("")) {
      (alertRef.current.querySelector(".title")! as HTMLElement).innerText =
        "Fields missing";
      (alertRef.current.querySelector(".desc")! as HTMLElement).innerText =
        "Please make sure to fill every field";
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
      <ChangeLanguage
        route="/uk/register"
        className="relative top-8 left-45 h-10 w-10"
        iconClass="!w-5 !h-5"
      />
      <form>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>Register new account</CardTitle>
            <CardDescription>
              Enter your email, username and password to register new account
            </CardDescription>
            <CardAction>
              <Link to="/en/login">Login instead</Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="username">Username</label>
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
              <label htmlFor="password">Password</label>
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
              <label htmlFor="repeat_password">Repeat password</label>
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
              Register
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
      <AlertDialog open={generatedPassword !== ""}>
        <AlertDialogContent className="gap-0">
          <AlertDialogHeader>
            <AlertDialogTitle>Password</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            We generated a password for your account. You will need to use this
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
