import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  familyId: string;
  className?: string;
};

const i18n = {
  en: {
    openFamily: "Open Family",
    familyId: "Your Family ID (click to copy)",
  },
  uk: {
    openFamily: "Відкрити Сім'ю",
    familyId: "Ваш ID сім'ї (натисніть щоб скопіювати)",
  },
};

export default function FamilyId({ familyId, className }: Props) {
  const familyIdRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  useEffect(() => {
    if (!familyIdRef.current) return;

    familyIdRef.current.addEventListener("click", async () => {
      if (!familyIdRef.current) return;
      await navigator.clipboard.writeText(familyId);

      familyIdRef.current.innerText = "Copied!";
      setTimeout(() => {
        if (!familyIdRef.current) return;
        familyIdRef.current.innerText = familyId.slice(0, 17);
      }, 1500);
    });
  }, [familyIdRef, familyId]);

  return (
    <div
      className={cn(
        "mt-2 flex h-50 flex-col items-center justify-around rounded-xl bg-card lg:h-[12vh]",
        className
      )}
    >
      <div>
        <Button onClick={() => navigate("/family?id=" + familyId)}>
          {t.openFamily}
        </Button>
      </div>
      <div
        className="text-2xl font-bold lg:text-3xl truncate text-center w-[80%]"
        id="family-id-value"
        ref={familyIdRef}
      >
        {familyId}
      </div>
      <label htmlFor="family-id-value" className="text-gray-400">
        {t.familyId}
      </label>
    </div>
  );
}
