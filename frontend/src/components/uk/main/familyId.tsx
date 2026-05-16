import { useEffect, useRef } from "react";

type Props = {
  familyId: string;
};

export default function FamilyId_uk({ familyId }: Props) {
  const familyIdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!familyIdRef.current) return;

    familyIdRef.current.addEventListener("click", async () => {
      if (!familyIdRef.current) return;
      const clipboardItemData = {
        ["text/plain"]: familyId,
      };
      const clipboard = new ClipboardItem(clipboardItemData);
      await navigator.clipboard.write([clipboard]);

      familyIdRef.current.innerText = "Скопійовано!";
      setTimeout(() => {
        if (!familyIdRef.current) return;
        familyIdRef.current.innerText = familyId.slice(0, 17);
      }, 1500);
    });
  }, [familyIdRef, familyId]);

  return (
    <div className="mt-2 flex h-[18.9vh] flex-col items-center justify-between rounded-xl bg-gradient-to-t from-primary/5 to-card">
      <div></div>
      <div className="text-5xl" id="family-id-value" ref={familyIdRef}>
        {familyId.slice(0, 17) + "..."}
      </div>
      <label htmlFor="family-id-value" className="text-gray-400">
        ID вашої сім'ї (натисніть щоб скопіювати)
      </label>
    </div>
  );
}
