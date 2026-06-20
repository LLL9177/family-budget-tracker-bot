import { AuthContext } from "@/contexts/AuthContext";
import type { ITransaction } from "@/types/Transaction.interface";
import { useContext, useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Trash2 } from "lucide-react";
import type { IUserData } from "@/types/UserData.interface";
import { AnimatePresence, motion } from "framer-motion";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../ui/combobox";
import { TransactionsContext } from "@/contexts/TransactionsContext";
import { FamilyContext } from "@/contexts/FamilyContext";
import useIsMobile from "@/hooks/useIsMobile";

type Props = {
  hide: () => void;
};

export default function Transactions_en({ hide }: Props) {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState<IUserData>();
  const [transaction, setTransaction] = useState<ITransaction | null>();
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const { transactions, setTransactions } = useContext(TransactionsContext);
  const { family } = useContext(FamilyContext);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchTransactions() {
      if (!family) return;
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `/transaction/get_family_transactions?family_uuid=${family.id}`,
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

    fetchTransactions();
  }, [auth.access, family, setTransactions]);

  useEffect(() => {
    if (!family) return;
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
  }, [auth.access, family]);

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

  const filterOptions = family
    ? [...family.members.map((user) => user.username), "Reset"]
    : [];

  return (
    <>
      {family && (
        <>
          <AnimatePresence mode="popLayout">
            <div
              className="fixed top-0 z-11 flex h-screen w-screen flex-col items-center justify-center gap-5 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm lg:flex-row"
              onClick={() => hide()}
            >
              {transaction && (
                <motion.div
                  key={transaction.id}
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                    x: isMobile ? 0 : 150,
                    y: isMobile ? 150 : 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.6,
                    x: isMobile ? 0 : 150,
                    y: isMobile ? 150 : 0,
                  }}
                >
                  <Card
                    className="min-h-40 w-[90vw] flex-row justify-between rounded-3xl p-4 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] lg:w-120 dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
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
                        {new Date(transaction.createdAt).toLocaleString(
                          "de-DE"
                        )}
                      </span>
                    </div>
                    <div
                      className={
                        "text-3xl font-medium " +
                        (transaction.amount > 0
                          ? "text-green-400 dark:text-green-300"
                          : "text-red-400 dark:text-red-300")
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
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
              >
                <Card
                  className="max-h-100 w-[90vw] overflow-y-scroll rounded-3xl p-2 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] select-none lg:max-h-200 lg:w-150 dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {transactions && transactions.length > 0 ? (
                    <>
                      <h1 className="self-center text-3xl font-semibold">
                        Transactions
                      </h1>
                      <div className="w-50 self-end">
                        <Combobox items={filterOptions}>
                          <ComboboxInput placeholder="Filter by user" />
                          <ComboboxContent>
                            <ComboboxEmpty>No users found</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem
                                  key={item}
                                  value={item}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (item == "Reset") {
                                      setFilterBy(null);
                                      return;
                                    }
                                    setFilterBy(item);
                                  }}
                                >
                                  {item}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </div>
                      {transactions
                        .filter((transaction) =>
                          filterBy
                            ? transaction.user.username == filterBy
                            : transaction
                        )
                        .map((transaction) => (
                          <motion.div
                            key={transaction.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{
                              opacity: 0,
                              scale: 0.5,
                            }}
                            transition={{
                              duration: 0.2,
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
                                    "text-2xl " +
                                    (transaction.amount > 0
                                      ? "text-green-400 dark:text-green-400"
                                      : "text-red-400 dark:text-red-300")
                                  }
                                >
                                  {transaction.amount}
                                </span>
                                {user && user.id == family!.owner.id && (
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
            </div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}
