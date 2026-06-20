import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  familyId: string;
  className?: string;
};

export default function FamilyId_en({ familyId, className }: Props) {
  const familyIdRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!familyIdRef.current) return;

    familyIdRef.current.addEventListener("click", async () => {
      if (!familyIdRef.current) return;
      const clipboardItemData = {
        ["text/plain"]: familyId,
      };
      const clipboard = new ClipboardItem(clipboardItemData);
      await navigator.clipboard.write([clipboard]);

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
        "mt-2 flex lg:h-[12vh] h-50 flex-col items-center justify-around rounded-xl bg-card",
        className
      )}
    >
      <div>
        <Button onClick={() => navigate("family?id=" + familyId)}>
          Open Family
        </Button>
      </div>
      <div
        className="lg:text-3xl text-2xl font-bold"
        id="family-id-value"
        ref={familyIdRef}
      >
        {familyId.slice(0, 25) + "..."}
      </div>
      <label htmlFor="family-id-value" className="text-gray-400">
        Your family ID (click to copy)
      </label>
    </div>
  );
}
