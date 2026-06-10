import { AuthContext } from "@/contexts/AuthContext";
import type { ITransaction } from "@/types/Transaction.interface";
import { useContext, useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import { Trash2 } from "lucide-react";
import type { IUserData } from "@/types/UserData.interface";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  familyId: string;
  active: boolean;
  ownerId: string;
};

export default function Transactions_en({ familyId, active, ownerId }: Props) {
  const [display, setDisplay] = useState(active);
  const auth = useContext(AuthContext);
  const [transactions, setTransactions] = useState<ITransaction[]>();
  const [user, setUser] = useState<IUserData>();
  const [transaction, setTransaction] = useState<ITransaction | null>();

  useEffect(() => {
    if (!familyId) return;
    async function fetchTransactions() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `/transaction/get_family_transactions?family_uuid=${familyId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "appliaction/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTransactions();
  }, [auth.access, familyId]);

  useEffect(() => {
    if (!familyId) return;
    async function fetchUser() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "appliaction/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, [auth.access, familyId]);

  function deleteTransaction(transaction: ITransaction) {
    async function fetchData() {
      try {
        await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `/transaction/delete?id=${transaction.id}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );

        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            "/transaction/get_family_transactions",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  function openTransaction(t: ITransaction) {
    if (!transaction) {
      setTransaction(t);
      return;
    }
    if (t.id == transaction.id) {
      setTransaction(null);
      return;
    }
    setTransaction(t);
  }

  return (
    <>
      {display && (
        <div
          className="fixed top-0 z-11 flex h-screen w-screen items-center justify-center gap-5 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
          onClick={() => setDisplay(false)}
        >
          <AnimatePresence mode="popLayout">
            {transaction && (
              <motion.div
                key={transaction.id}
                initial={{
                  opacity: 0,
                  scale: 0.6,
                  x: 150,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.6,
                  x: 150,
                }}
              >
                <Card
                  className="min-h-40 w-120 flex-row justify-between p-4 rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">
                      {transaction.user.username}
                    </h1>
                    <span className="text-lg font-medium">
                      Category: {transaction.category}
                    </span>
                    <span className="text-lg text-gray-400">
                      Submitted at:{" "}
                      {new Date(transaction.createdAt).toLocaleString("de-DE")}
                    </span>
                  </div>
                  <div
                    className={
                      "text-3xl font-medium " +
                      (transaction.amount > 0
                        ? "text-green-300"
                        : "text-red-300")
                    }
                  >
                    {transaction.amount}
                  </div>
                </Card>
              </motion.div>
            )}
            <motion.div
              layout
              transition={{
                duration: 0.2,
              }}
            >
              <Card
                className="max-h-400 w-150 overflow-y-scroll rounded-3xl p-2 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {transactions && transactions.length > 0 ? (
                  <>
                    <h1 className="self-center text-3xl font-semibold">
                      Transactions
                    </h1>
                    {transactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.5,
                          transition: {
                            duration: 0.15,
                          },
                        }}
                      >
                        <Card
                          className="flex cursor-pointer flex-row justify-between rounded-2xl p-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTransaction(transaction);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-lg font-medium">
                              {transaction.category}
                            </span>
                            <span className="text-gray-400">
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString("de-DE")}
                            </span>
                          </div>
                          <div className="flex items-center gap-5 self-center">
                            <span
                              className={
                                "text-lg " +
                                (transaction.amount > 0
                                  ? "text-green-400"
                                  : "text-red-300")
                              }
                            >
                              {transaction.amount}
                            </span>
                            {user && user.id == ownerId && (
                              <Trash2
                                className="cursor-pointer text-red-400 hover:text-red-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTransaction(transaction);
                                }}
                              />
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div
                    className="p-6 text-center text-lg text-white/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    No transactions yet
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
