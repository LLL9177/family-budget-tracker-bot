import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { useContext } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const i18n = {
  en: {
    dangerZone: "Danger Zone",
    deleteAccount: "Delete Account",
    logOut: "Log out",
    deleteTitle: "Delete your account?",
    deleteDescription:
      "This action cannot be undone. Your account and all associated data will be permanently deleted.",
    logoutTitle: "Log out?",
    logoutDescription: "You'll need to sign in again to access your account.",
    cancel: "Cancel",
    confirmDelete: "Delete account",
    confirmLogout: "Log out",
  },
  uk: {
    dangerZone: "Небезпечна зона",
    deleteAccount: "Видалити Аккаунт",
    logOut: "Вийти з аккаунту",
    deleteTitle: "Видалити акаунт?",
    deleteDescription:
      "Цю дію неможливо скасувати. Ваш акаунт і всі пов'язані з ним дані будуть остаточно видалені.",
    logoutTitle: "Вийти з акаунту?",
    logoutDescription:
      "Для повторного доступу до акаунта вам потрібно буде увійти знову.",
    cancel: "Скасувати",
    confirmDelete: "Видалити акаунт",
    confirmLogout: "Вийти",
  },
};

export default function DangerZone() {
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];
  const auth = useContext(AuthContext);

  function deleteAccount() {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/delete-account", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });
        auth.setAccess("");
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  function logOut() {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });
        auth.setAccess("");
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  return (
    <div className="mt-8 flex flex-col items-start gap-5 rounded-2xl border border-red-600/20 bg-red-400/20 p-6 transition dark:bg-red-500/10">
      <h2 className="text-muted-foreground">{t.dangerZone}</h2>
      <div className="flex flex-col items-start">
        <div className="flex flex-col items-start gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{t.deleteAccount}</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={deleteAccount}
                >
                  {t.deleteAccount}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost">{t.logOut}</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.logoutTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.logoutDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={logOut}>{t.logOut}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
