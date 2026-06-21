"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FamilyContext } from "@/contexts/FamilyContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import useIsMobile from "@/hooks/useIsMobile";
import Transactions from "./transactions";
import Notifications from "./notifications";
import Users from "./users";
import TelegramRequests from "./telegram-request";

const MARGIN = 40;

function getNearestCorner(x: number, y: number) {
  const corners = [
    { x: MARGIN, y: MARGIN },
    { x: window.innerWidth - MARGIN, y: MARGIN },
    { x: MARGIN, y: window.innerHeight - MARGIN },
    { x: window.innerWidth - MARGIN, y: window.innerHeight - MARGIN },
  ];

  return corners.reduce((closest, corner) =>
    Math.hypot(x - corner.x, y - corner.y) <
    Math.hypot(x - closest.x, y - closest.y)
      ? corner
      : closest
  );
}

function FixedAnchor({
  x,
  y,
  className,
  children,
}: {
  x: number;
  y: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {children}
    </div>
  );
}

export default function Navigation({ exclude }: { exclude: string }) {
  const ITEMS = [
    "createFamily",
    "renewOtp",
    "family",
    "users",
    "transactions",
    "register",
    "connectFamily",
    "authRequests",
    "login",
    "profile",
    "dashboard",
    "notifications",
    "switchLanguage",
  ];

  const i18n = {
    en: {
      items: {
        createFamily: "Create Family Page",
        renewOtp: "Renew OTP Page",
        family: "Family Page",
        users: "Users",
        transactions: "Transactions",
        register: "Register Page",
        connectFamily: "Connect Family Page",
        authRequests: "Auth Requests",
        login: "Login Page",
        profile: "Profile Page",
        notifications: "Notifications",
        dashboard: "Dashboard",
        switchLanguage: "Switch Language",
      },
    },

    uk: {
      items: {
        createFamily: "Сторінка створення сім'ї",
        renewOtp: "Оновлення OTP",
        family: "Сімейна сторінка",
        users: "Користувачі",
        transactions: "Транзакції",
        register: "Реєстрація",
        connectFamily: "Підключення сім'ї",
        authRequests: "Запити авторизації",
        login: "Вхід",
        profile: "Профіль",
        notifications: "Сповіщення",
        dashboard: "Інфо. панель",
        switchLanguage: "Змінити мову",
      },
    },
  };

  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: MARGIN, y: MARGIN });

  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const cornerPositionRef = useRef({ x: MARGIN, y: MARGIN });
  const [openedItem, setOpenedItem] = useState<string | null>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { family, setFamily } = useContext(FamilyContext);

  const itemIndex = ITEMS.findIndex((item) => item == exclude);
  if (itemIndex > -1) {
    ITEMS.splice(itemIndex, 1);
  }

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      didDragRef.current = true;
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleUp = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);

      setPosition((current) => {
        const nearest = getNearestCorner(current.x, current.y);
        cornerPositionRef.current = nearest;
        return nearest;
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  useEffect(() => {
    if (family) return;
    async function fetchData() {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.access ? `Bearer ${auth.access}` : "",
          },
        });

        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        setFamily(data.family);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [auth.access, family, setFamily]);

  const toggleMenu = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (isMobile) {
      setIsOpen((v) => !v);
      return;
    }

    if (isOpen) {
      setIsOpen(false);
      setPosition(cornerPositionRef.current);
      return;
    }

    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    setTimeout(() => {
      setIsOpen(true);
    }, 200);
  };

  function navigateTo(item: string) {
    if (item == t.items.family && family) {
      navigate(`/family?id=${family.id}`);
    } else if (item == t.items.register) {
      navigate("/register");
    } else if (item == t.items.login) {
      navigate("/login");
    } else if (item == t.items.profile) {
      async function fetchUser() {
        try {
          const data = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/auth/profile",
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: auth.access ? `Bearer ${auth.access}` : "",
              },
            }
          ).then((res) => res.json());
          navigate(`/user?id=${data.id}`);
        } catch (err) {
          console.error(err);
        }
      }

      fetchUser();
    } else if (item == t.items.dashboard) {
      navigate("/dashboard");
    } else if (item == t.items.renewOtp) {
      navigate("/renew");
    } else if (item == t.items.connectFamily) {
      navigate("/connect_family");
    } else if (item == t.items.createFamily) {
      navigate("/create_family");
    }
  }

  function handleItemClick(item: string) {
    if (item == t.items.switchLanguage) {
      const lang = localStorage.getItem("lang");
      console.log(lang);
      localStorage.setItem("lang", lang == "en" ? "uk" : "en");
      window.location.reload();
      return;
    }

    navigateTo(item);
  }

  const growUp = cornerPositionRef.current.y > window.innerHeight / 2;
  const growLeft = cornerPositionRef.current.x > window.innerWidth / 2;

  console.log(family);

  return (
    <>
      {family && (
        <>
          {/* Backdrop — mobile only */}
          {isMobile && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm dark:bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={toggleMenu}
                />
              )}
            </AnimatePresence>
          )}

          {/* Main button */}
          <FixedAnchor
            x={position.x}
            y={position.y}
            className={
              isDragging ? "z-30" : "z-30 transition-[left,top] duration-300"
            }
          >
            <motion.button
              onMouseDown={() => {
                if (isOpen) return;
                isDraggingRef.current = true;
                didDragRef.current = false;
                setIsDragging(true);
              }}
              onClick={toggleMenu}
              animate={
                isMobile
                  ? { rotate: isOpen ? 90 : 0 }
                  : { scale: isOpen ? 2 : 1 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "rounded-full bg-black p-3 text-white dark:bg-white dark:text-black",
                isDragging ? "cursor-grabbing" : "cursor-grab",
                isOpen
                  ? "shadow-[0_0_10px_0_rgb(100,100,100)] dark:shadow-[0_0_20px_0_white]"
                  : ""
              )}
              hidden={openedItem ? true : false}
            >
              {isMobile && isOpen ? <X /> : <Menu />}
            </motion.button>
          </FixedAnchor>

          {/* MOBILE: column card menu */}
          {isMobile && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className={cn(
                    "fixed z-20 flex max-h-[70vh] w-[min(80vw,280px)] flex-col gap-1 overflow-y-auto rounded-2xl border bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:bg-black dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)]",
                    growLeft ? "items-end" : "items-start"
                  )}
                  style={{
                    left: growLeft ? undefined : position.x,
                    right: growLeft
                      ? window.innerWidth - position.x
                      : undefined,
                    top: growUp ? undefined : position.y + 50,
                    bottom: growUp
                      ? window.innerHeight - position.y + 50
                      : undefined,
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: growUp ? 10 : -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: growUp ? 10 : -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                >
                  {ITEMS.map((key, i) => {
                    const item = t.items[key];
                    return (
                      <motion.button
                        key={item}
                        className="w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm hover:bg-[rgb(240,240,240)] dark:hover:bg-[rgb(30,30,30)]"
                        initial={{ opacity: 0, x: growLeft ? 12 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => {
                          handleItemClick(item);
                          setIsOpen(false);
                          setOpenedItem(item);
                        }}
                      >
                        {item}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* DESKTOP: original radial menu, untouched */}
          {!isMobile && (
            <AnimatePresence mode="popLayout">
              {isOpen &&
                ITEMS.map((key, i) => {
                  const item = t.items[key];
                  const radius = 250;
                  const angle = (i / ITEMS.length) * Math.PI * 2;
                  const x = position.x + Math.cos(angle) * radius;
                  const y = position.y + Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={item}
                      className="fixed z-20"
                      style={{ transform: "translate(-50%, -50%)" }}
                      initial={{ left: position.x, top: position.y }}
                      animate={{ left: x, top: y }}
                      exit={{ left: position.x, top: position.y }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                        delay: i * 0.04,
                      }}
                    >
                      <motion.button
                        className="cursor-pointer rounded-full border bg-background px-4 py-2 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] hover:bg-[rgb(240,240,240)] dark:shadow-[0_0_10px_0_rgba(255,255,255,0.1)] dark:hover:bg-[rgb(30,30,30)]"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                          delay: i * 0.04,
                        }}
                        onClick={() => {
                          handleItemClick(item);
                          setIsOpen(false);
                          setPosition(cornerPositionRef.current);
                          setOpenedItem(item);
                        }}
                      >
                        {item}
                      </motion.button>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {openedItem == t.items.notifications ? (
              <Notifications hide={() => setOpenedItem(null)} />
            ) : openedItem == t.items.transactions ? (
              <Transactions hide={() => setOpenedItem(null)} />
            ) : openedItem == t.items.users ? (
              <Users hide={() => setOpenedItem(null)} />
            ) : openedItem == t.items.authRequests ? (
              <TelegramRequests hide={() => setOpenedItem(null)} />
            ) : (
              <></>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
