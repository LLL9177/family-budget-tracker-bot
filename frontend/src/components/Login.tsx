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

export default function Login({ setJwt }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="flex min-h-screen items-center justify-center bg-[#1a191f]">
      <form>
        <Card className="w-100">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username and password below to login to your account
            </CardDescription>
            <CardAction className="cursor-pointer">Sign Up</CardAction>
          </CardHeader>
          <CardContent>
            <label htmlFor="username">Username</label>
            <Input
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
              id="password"
              className="mt-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </CardContent>
          <CardFooter className="flex-col">
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
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
