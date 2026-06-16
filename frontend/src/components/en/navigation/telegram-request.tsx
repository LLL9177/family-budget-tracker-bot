import { Card } from "@/components/ui/card";
import { AuthContext } from "@/contexts/AuthContext";
import type { ITelegramRequest } from "@/types/TelegramRequest.interface";
import { AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type Props = {
  hide: () => void;
};

export default function TelegramRequests_en({ hide }: Props) {
  const [requests, setRequests] = useState<ITelegramRequest[]>();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth.access) return;
    async function fetchData() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authroization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );

        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setRequests(data.telegramRequests);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [auth.access]);

  function accept(request: ITelegramRequest) {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/telegram/accept", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ id: request.id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.access}`,
          },
        });

        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authroization: `Bearer ${auth.access}`,
            },
          }
        );

        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setRequests(data.telegramRequests);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  function deny(request: ITelegramRequest) {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/telegram/deny", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ id: request.id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.access}`,
          },
        });

        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authroization: `Bearer ${auth.access}`,
            },
          }
        );

        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setRequests(data.telegramRequests);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="fixed top-0 z-10 w-screen"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <div
            className="fixed top-0 z-12 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => hide()}
          >
            {requests && requests.length > 0 ? (
              <motion.div
                layout
                initial={{
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                }}
              >
                <Card
                  className="max-h-200 w-150 gap-7 overflow-y-scroll rounded-3xl p-2 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] select-none dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center gap-3 pt-3">
                    <h1 className="text-3xl font-semibold">
                      Telegram Login Requests
                    </h1>
                    <p className="text-center text-lg">
                      They are, the requests sent from the bot when someone
                      tries to login with your account in our bot.
                    </p>
                  </div>
                  <div>
                    {requests.map((request) => (
                      <motion.div
                        key={request.id}
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
                          className="flex flex-row items-center justify-between bg-white/2 px-4 text-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          @{request.telegramUsername}
                          <div className="flex gap-2">
                            <Check
                              className="cursor-pointer text-green-400 dark:text-green-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                accept(request);
                              }}
                            />
                            <X
                              className="cursor-pointer text-red-400 dark:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                deny(request);
                              }}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="flex w-150 items-center justify-center overflow-y-scroll rounded-3xl p-5 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] select-none dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]">
                <h1 className="text-3xl">No requests</h1>
                <p className="text-center text-lg text-gray-500">
                  You will see them when somebody tries to login to your account
                  in the bot
                </p>
              </Card>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
