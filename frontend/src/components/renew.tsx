import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import Navigation from "./navigation/navigation";

const i18n = {
  en: {
    dialogTitle: "One-time password",
    dialogDescription: "Your new one-time password has been generated:",
  },

  uk: {
    dialogTitle: "Одноразовий пароль",
    dialogDescription: "Ось ваш щойно згенерований одноразовий пароль:",
  },
};

export default function Renew() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/one-time-password/renew",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.otp) setOtp(data.otp);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [auth]);
  return (
    <div>
      <Navigation exclude="renewOtp" />
      <AlertDialog open={otp !== ""}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <span className="password-span mt-3 mb-5">{otp}</span>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-white !text-black"
              onClick={() => navigate("/dashboard")}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
