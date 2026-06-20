"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Notifications_en from "./notifications";
import Transactions_en from "./transactions";
import Users_en from "./users";
import { FamilyContext } from "@/contexts/FamilyContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import TelegramRequests_en from "./telegram-request";
import useIsMobile from "@/hooks/useIsMobile";

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

export default function Navigation_en({ exclude }: { exclude: string }) {
  const ITEMS = [
    "Create Family Page",
    "Renew OTP Page",
    "Family Page",
    "Users",
    "Transactions",
    "Register Page",
    "Connect Family Page",
    "Auth Requests",
    "Login Page",
    "Profile Page",
    "Notifications",
    "Main Page",
  ];

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

  const { family } = useContext(FamilyContext);

  const itemIndex = ITEMS.findIndex((item) => item == exclude);
  if (itemIndex > -1) {
    ITEMS.splice(itemIndex, 1);
  }

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
    if (item == "Family Page" && family) {
      navigate(`/en/family?id=${family.id}`);
    } else if (item == "Register Page") {
      navigate("/en/register");
    } else if (item == "Login Page") {
      navigate("/en/login");
    } else if (item == "Profile Page") {
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
          navigate(`/en/user?id=${data.id}`);
        } catch (err) {
          console.error(err);
        }
      }

      fetchUser();
    } else if (item == "Main Page") {
      navigate("/en");
    } else if (item == "Renew OTP Page") {
      navigate("/en/renew");
    } else if (item == "Connect Family Page") {
      navigate("/en/connect_family");
    } else if (item == "Create Family Page") {
      navigate("/en/create_family");
    }
  }

  const growUp = cornerPositionRef.current.y > window.innerHeight / 2;
  const growLeft = cornerPositionRef.current.x > window.innerWidth / 2;

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
                  {ITEMS.map((item, i) => (
                    <motion.button
                      key={item}
                      className="w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm hover:bg-[rgb(240,240,240)] dark:hover:bg-[rgb(30,30,30)]"
                      initial={{ opacity: 0, x: growLeft ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        navigateTo(item);
                        setIsOpen(false);
                        setOpenedItem(item);
                      }}
                    >
                      {item}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* DESKTOP: original radial menu, untouched */}
          {!isMobile && (
            <AnimatePresence mode="popLayout">
              {isOpen &&
                ITEMS.map((item, i) => {
                  const radius = 230;
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
                          navigateTo(item);
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
            {openedItem == "Notifications" ? (
              <Notifications_en hide={() => setOpenedItem(null)} />
            ) : openedItem == "Transactions" ? (
              <Transactions_en hide={() => setOpenedItem(null)} />
            ) : openedItem == "Users" ? (
              <Users_en hide={() => setOpenedItem(null)} />
            ) : openedItem == "Auth Requests" ? (
              <TelegramRequests_en hide={() => setOpenedItem(null)} />
            ) : (
              <></>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
