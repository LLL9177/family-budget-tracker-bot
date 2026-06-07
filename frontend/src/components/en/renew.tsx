import { useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

export default function Renew_en() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

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

        console.log(res);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log(data);
        if (data.otp) setOtp(data.otp);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [auth]);
  return (
    <div>
      <AlertDialog open={otp !== ""}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>One-time password</AlertDialogTitle>
            <AlertDialogDescription>
              Here's your freshly new generated one-time password:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <span className="password-span mt-3 mb-5">{otp}</span>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-white !text-black"
              onClick={() => navigate("/en")}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
