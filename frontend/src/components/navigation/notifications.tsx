import { AuthContext } from "@/contexts/AuthContext";
import type { IUserData } from "@/types/UserData.interface";
import { useContext, useEffect, useRef, useState } from "react";
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
import useIsMobile from "@/hooks/useIsMobile";
import {
  getNotificationText,
} from "@/components/resources/NotificationResource";
import { Card, CardFooter, CardHeader } from "../ui/card";

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
    color: "dark:text-blue-600 text-blue-500",
  },
};

const i18n = {
  en: {
    noNotifications: "No notifications",
    clearAll: "Clear All",
  },
  uk: {
    noNotifications: "Немає сповіщень",
    clearAll: "Очистити все",
  },
};

export default function Notifications({ hide }: Props) {
  const [user, setUser] = useState<IUserData>();
  const auth = useContext(AuthContext);
  const [notification, setNotification] = useState<{
    plain: INotification;
    text: { title: string; body: string };
  } | null>(); // currently viewing
  const notificationRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const lang = localStorage.getItem("lang") == "en" ? "en" : "uk";
  const t = i18n[lang];

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

  function openNotification(n: {
    plain: INotification;
    text: {
      title: string;
      body: string;
    };
  }) {
    if (!notification) {
      setNotification(n);
      return;
    }
    if (notification.plain.id == n.plain.id && notificationRef.current) {
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

  function removeNotification(n: {
    plain: INotification;
    text: {
      title: string;
      body: string;
    };
  }) {
    async function fetchData() {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/notification/delete", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ id: n.plain.id }),
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

        if (notification?.plain.id == n.plain.id) {
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
            className="fixed top-0 z-50 w-screen"
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
              className="top-0 flex h-screen w-screen flex-col items-center justify-center gap-5 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm lg:flex-row"
              onClick={() => hide()}
            >
              {notification && (
                <motion.div
                  key={notification.plain.id}
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
                    x: 150,
                  }}
                >
                  <Card
                    ref={notificationRef}
                    className="w-[90vw] shadow-[0_0_40px_0_rgba(255,255,255,0.3)] lg:w-150 dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CardHeader className="text-2xl font-bold">
                      {notification.text.title}
                    </CardHeader>
                    <CardFooter className="text-lg">
                      {notification.text.body}
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
                  className="max-h-100 w-[90vw] gap-2 overflow-y-scroll rounded-3xl bg-card p-2 shadow-[0_0_40px_0_rgba(255,255,255,0.3)] lg:max-h-200 lg:w-150 dark:shadow-[0_0_40px_0_rgba(255,255,255,0.08)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.notifications.length === 0 ? (
                    <div className="p-6 text-center text-lg text-white/50">
                      {t.noNotifications}
                    </div>
                  ) : (
                    <>
                      <motion.button
                        className="mb-2 flex h-5 px-2 cursor-pointer items-center justify-center self-end rounded-xl border-[1px] border-[rgba(180,180,180,0.3)] bg-[rgba(180,180,180,0.1)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearAll();
                        }}
                        whileHover={{ transform: "translateY(2px)" }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        {t.clearAll}
                      </motion.button>
                      {user.notifications.map((notificationPlain) => {
                        const notification = getNotificationText(
                          notificationPlain.key,
                          notificationPlain.meta,
                          lang
                        );
                        return (
                          <motion.div
                            key={notificationPlain.id}
                            variants={item}
                          >
                            <Card
                              className="flex cursor-pointer flex-row justify-between bg-white/2 p-4 text-xl hover:bg-white/4"
                              onClick={() =>
                                openNotification({
                                  plain: notificationPlain,
                                  text: notification,
                                })
                              }
                            >
                              <div className="flex gap-4">
                                <NotificationIcon
                                  icon={notificationPlain.icon}
                                />
                                {notification.title}
                              </div>
                              <Trash2
                                className="text-red-400 hover:text-red-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification({
                                    plain: notificationPlain,
                                    text: notification,
                                  });
                                }}
                              />
                            </Card>
                          </motion.div>
                        );
                      })}
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
