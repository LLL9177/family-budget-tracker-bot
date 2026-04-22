import { useContext, useEffect, useState } from "react";
import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { AlertDialog } from "../ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

export default function Renew_en() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async function() {
      try {
        const data = await fetch(import.meta.env.VITE_BACKEND_URL + "/one-time-password/renew",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Contnt-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : '',
            }
          }).then((res) => res.json())

        if (data.otp) setOtp(data.otp)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <AlertDialog open={otp !== ''}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>One-time password</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Here's your freshly new generated one-time password:
          </AlertDialogDescription>
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
  )
}
