import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { IMonthlySummary } from "@/types/MonthlySummary.interface";
import MonthComparison from "./monthComparison";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  familyId: string;
  captionText?: string;
};

interface IMonthDate {
  year: number;
  month: number;
}

const i18n = {
  en: {
    month1: "Month 1",
    month2: "Month 2",
    set: "Set",
    caption: (month1Str: string, month2Str: string) =>
      `${month1Str} and ${month2Str} Comparison`,
  },
  uk: {
    month1: "Місяць 1",
    month2: "Місяць 2",
    set: "Встановити",
    caption: (month1Str: string, month2Str: string) =>
      `Порівняння ${month1Str} і ${month2Str}`,
  },
};

// This one is for choosing between different months
export default function DifferentMonthsComparison({
  familyId,
  captionText,
}: Props) {
  const [monthOne, setMonthOne] = useState<IMonthDate | null>(null);
  const [monthTwo, setMonthTwo] = useState<IMonthDate | null>(null);
  const monthOneRef = useRef<HTMLInputElement>(null);
  const monthTwoRef = useRef<HTMLInputElement>(null);
  const auth = useContext(AuthContext);
  const [monthOneData, setMonthOneData] = useState<IMonthlySummary>();
  const [monthTwoData, setMonthTwoData] = useState<IMonthlySummary>();

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  function validateDate(date: IMonthDate) {
    const now = new Date();
    if (date.year > now.getFullYear()) return false;
    if (date.year === now.getFullYear() && date.month > now.getMonth() + 1)
      return false;
    return true;
  }

  function setMonth(num: 1 | 2, value: string) {
    const [year, month] = value.split("-").map((val) => parseInt(val));
    const date: IMonthDate = { year, month };
    if (validateDate(date)) {
      if (num == 1) setMonthOne(date);
      else setMonthTwo(date);
    }
  }

  useEffect(() => {
    if (!monthOne) return;
    const getMonthOne = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/transaction/monthly_summary",
          {
            method: "POST",
            body: JSON.stringify({
              familyId,
              month: monthOne.month,
              year: monthOne.year,
            }),
            credentials: "include",
            headers: {
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
              "Content-Type": "application/json",
            },
          }
        ).then((data) => data.json());

        console.log(data);
        setMonthOneData(data);
      } catch {
        console.log("");
      }
    };

    getMonthOne();
  }, [monthOne, auth.access, familyId]);

  useEffect(() => {
    if (!monthTwo) return;
    const getMonthOne = async function () {
      try {
        const data = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/transaction/monthly_summary",
          {
            method: "POST",
            body: JSON.stringify({
              familyId,
              month: monthTwo.month,
              year: monthTwo.year,
            }),
            credentials: "include",
            headers: {
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
              "Content-Type": "application/json",
            },
          }
        ).then((data) => data.json());

        setMonthTwoData(data);
      } catch {
        console.log("");
      }
    };

    getMonthOne();
  }, [monthTwo, auth.access, familyId]);

  let caption = "";
  let month1Str = "";
  let month2Str = "";
  if (monthOne && monthTwo) {
    month1Str = `${monthOne.year}-${String(monthOne.month).padStart(2, "0")}`;
    month2Str = `${monthTwo.year}-${String(monthTwo.month).padStart(2, "0")}`;
    caption = captionText ?? t.caption(month1Str, month2Str);
  }

  return (
    <div className="mt-2 h-116 w-[90vw] lg:w-full rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card">
      <form
        className="-mb-2 flex w-full flex-col items-center gap-2 rounded-t-xl border-1 bg-[rgba(150,150,150,0.1)] p-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!monthOneRef.current || !monthTwoRef.current) return;
          setMonth(1, monthOneRef.current.value);
          setMonth(2, monthTwoRef.current.value);
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center">
            <label htmlFor="month-1">{t.month1}</label>
            <Input
              type="month"
              pattern="\d{4}-\d{2}"
              placeholder="YYYY-MM"
              id="month-1"
              ref={monthOneRef}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="month-1">{t.month2}</label>
            <Input
              type="month"
              pattern="\d{4}-\d{2}"
              placeholder="YYYY-MM"
              id="month-2"
              ref={monthTwoRef}
              autoComplete="off"
            />
          </div>
        </div>
        <Button className="w-[95%]">{t.set}</Button>
      </form>
      <div className="rounded-b-xl h-88 border-1 border-t-0">
        <MonthComparison
          data={{
            prev: monthOneData,
            current: monthTwoData,
          }}
          caption={caption}
          monthOneName={month1Str}
          monthTwoName={month2Str}
        />
      </div>
    </div>
  );
}
