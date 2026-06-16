import { AuthContext } from "@/contexts/AuthContext";
import type { IUserData } from "@/types/UserData.interface";
import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardFooter, CardHeader } from "../../ui/card";
import type { INotification } from "@/types/Notification.interface";
import { AnimatePresence, motion } from "framer-motion";
import {
    LogIn,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import type { IconEnum } from "@/enums/IconEnum";

type Props = {
  hide: () => void;
};

const notificationMeta = {
  JOIN_REQUEST: {
    icon: UserPlus,
    color: "dark:text-yellow-400 text-yellow-500",
  },
  JOINED: {
    icon: Users,
    color: "text-blue-400",
  },
  KICKED: {
    icon: UserX,
    color: "text-red-400",
  },
  ACCEPTED: {
    icon: UserCheck,
    color: "text-green-400",
  },
  REJECTED: {
    icon: XCircle,
    color: "text-red-400",
  },
  AUTH_REQUEST: {
    icon: LogIn,
    color: "dark:text-blue-600 text-blue-500"
  }
};

export default function Notifications_en({ hide }: Props) {
  const [user, setUser] = useState<IUserData>();
  const auth = useContext(AuthContext);
  const [notification, setNotification] = useState<INotification | null>(); // currently viewing
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
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
        const accessToken = res.headers.get("x-access-token");
        if (accessToken) auth.setAccess(accessToken);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [auth]);

  console.log(user)

  function openNotification(n: INotification) {
    if (!notification) {
      setNotification(n);
      return;
    }
    if (notification.id == n.id && notificationRef.current) {
      setNotification(null);
      return;
    }
    setNotification(n);
  }

  const item = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    show: {
      opacity: 1,
      x: 0,
    },
  };

  function removeNotification(n: INotification) {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/notification/delete", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ id: n.id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });

        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
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
        const accessToken = res.headers.get("x-access-token");
        if (accessToken) auth.setAccess(accessToken);

        const data = await res.json();
        setUser(data);

        if (notification?.id == n.id) {
          setNotification(null);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  function clearAll() {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/notification/clear", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });

        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/auth/profile",
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
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }

  return (
    <>
      <AnimatePresence mode="popLayout">
        {user && (
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
              className="top-0 flex h-screen w-screen items-center justify-center gap-5 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
              onClick={() => hide()}
            >
              {notification && (
                <motion.div
                  key={notification.id}
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
                    ref={notificationRef}
                    className="w-150 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CardHeader className="text-2xl font-bold">
                      {notification.title}
                    </CardHeader>
                    <CardFooter className="text-lg">
                      {notification.body}
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
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
                  className="max-h-200 w-150 gap-2 overflow-y-scroll rounded-3xl bg-card p-2 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.notifications.length === 0 ? (
                    <div className="p-6 text-center text-lg text-white/50">
                      No notifications
                    </div>
                  ) : (
                    <>
                      <motion.button
                        className="mb-2 flex h-5 w-20 cursor-pointer items-center justify-center self-end rounded-xl border-[1px] border-[rgba(180,180,180,0.3)] bg-[rgba(180,180,180,0.1)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearAll();
                        }}
                        whileHover={{ transform: "translateY(2px)" }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        Clear all
                      </motion.button>
                      {user.notifications.map((notification) => (
                        <motion.div key={notification.id} variants={item}>
                          <Card
                            className="flex cursor-pointer flex-row justify-between bg-white/2 p-4 text-xl hover:bg-white/4"
                            onClick={() => openNotification(notification)}
                          >
                            <div className="flex gap-4">
                              <NotificationIcon icon={notification.icon} />
                              {notification.title}
                            </div>
                            <Trash2
                              className="text-red-400 hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification);
                              }}
                            />
                          </Card>
                        </motion.div>
                      ))}
                    </>
                  )}
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NotificationIcon({ icon }: { icon: IconEnum }) {
  const meta = notificationMeta[icon];
  return <meta.icon className={meta.color} />;
}
