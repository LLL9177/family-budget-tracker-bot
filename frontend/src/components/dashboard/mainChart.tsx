"use client";

import {
  Bar,
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import { BarChart3, LineChart as LineChartIcon } from "lucide-react";
import type { ITransaction } from "@/types/Transaction.interface";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chartConfig = {
  PnL: {
    label: "PnL",
    color: "#2cddb7",
  },
} satisfies ChartConfig;

type Props = {
  data: ITransactionWithDate[] | ITransaction[];
  className?: string;
};

const i18n = {
  en: {
    day: "Day",
    title: "PnL of Current Month",
    subtitle: "This month's difference in balance",

    lineChart: "Line chart",
    barChart: "Bar chart",

    days: "Days",
    transactions: "Transactions",

    pnl: "PnL",
  },

  uk: {
    day: "День",
    title: "PnL поточного місяця",
    subtitle: "Зміна балансу за цей місяць",

    lineChart: "Лінійний графік",
    barChart: "Стовпчиковий графік",

    days: "Дні",
    transactions: "Транзакції",

    pnl: "Прибуток/збиток",
  },
};

export default function MainChart({ data, className }: Props) {
  const [displayMode, setDisplayMode] = useState("bars");
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme;
  const [frame, setFrame] = useState("days");
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  // keep raw transactions for the "transactions" frame
  const monthTransactions = data.filter((t) => {
    const today = new Date();
    return (
      new Date(t.createdAt).getMonth() === today.getMonth() &&
      new Date(t.createdAt).getFullYear() === today.getFullYear()
    );
  });

  // group by day for the "days" frame
  const dayMap = new Map<number, number>();
  for (const t of monthTransactions) {
    const day = new Date(t.createdAt).getDate();
    dayMap.set(day, (dayMap.get(day) ?? 0) + t.amount);
  }

  const sortedDays = Array.from(dayMap.entries()).sort(([a], [b]) => a - b);

  let running = 0;

  const chartData =
    frame === "days"
      ? sortedDays.map(([day, total]) => {
          running += total;

          return {
            date: `${t.day} ${day}`,
            PnL: running,
          };
        })
      : (() => {
          let running = 0;

          const sorted = [...monthTransactions].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          return sorted.map((tr, i) => {
            running += tr.amount;

            return {
              transactionIndex: String(i + 1),
              PnL: running,
              date: `${t.day} ${new Date(tr.createdAt).getDate()}`,
            };
          });
        })();

  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      <div className="h-[match-content] w-full rounded-[30px] border border-[rgb(100,100,100)] bg-card p-10 lg:h-190 lg:w-350">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-[54%] lg:px-10">
          <div>
            <h2 className="mb-2 text-[15px] font-bold lg:text-xl">{t.title}</h2>
            <span className="text-[rgb(100,100,100)]">{t.subtitle}</span>
          </div>
          <div className="flex pb-10">
            <div className="mr-10 flex h-10 space-x-[10%]">
              <button
                className={`cursor-pointer rounded border-[2px] px-1 hover:bg-gray-200 dark:hover:bg-[rgb(50,50,50)] ${
                  displayMode == "line" ? "border-[rgb(100,100,100)]" : ""
                } `}
                onClick={() => {
                  setDisplayMode("line");
                }}
              >
                <LineChartIcon />
              </button>
              <button
                className={`cursor-pointer rounded border-[2px] px-1 hover:bg-gray-200 dark:hover:bg-[rgb(50,50,50)] ${
                  displayMode == "bars" ? "border-[rgb(100,100,100)]" : ""
                } `}
                onClick={() => {
                  setDisplayMode("bars");
                }}
              >
                <BarChart3 />
              </button>
            </div>
            <div>
              <ButtonGroup
                aria-label="Button group"
                className="rounded-lg border-1 border-[rgb(50,50,50)]"
              >
                <Button
                  className={`text-[16px] ${
                    frame == "days"
                      ? currentTheme == "dark"
                        ? "bg-[rgb(30,30,30)]"
                        : "bg-[rgb(255,255,255)]"
                      : currentTheme == "dark"
                        ? "bg-[rgb(15,15,15)]"
                        : "bg-[rgb(240,240,240)]"
                  } p-4 ${currentTheme == "dark" ? "text-white" : "text-black"}`}
                  onClick={() => {
                    setFrame("days");
                  }}
                >
                  {t.days}
                </Button>
                <Button
                  className={`text-[16px] ${
                    frame == "transactions"
                      ? currentTheme == "dark"
                        ? "bg-[rgb(30,30,30)]"
                        : "bg-[rgb(255,255,255)]"
                      : currentTheme == "dark"
                        ? "bg-[rgb(15,15,15)]"
                        : "bg-[rgb(240,240,240)]"
                  } p-4 ${currentTheme == "dark" ? "text-white" : "text-black"}`}
                  onClick={() => {
                    setFrame("transactions");
                  }}
                >
                  {t.transactions}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="max-h-150 w-full rounded-xl border-1 bg-[rgba(150,150,150,0.1)] lg:p-10 lg:pt-15"
        >
          {displayMode == "bars" ? (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={frame == "days" ? "date" : "transactionIndex"}
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                interval="preserveStartEnd"
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="PnL" fill="var(--color-PnL)" radius={8} />
            </BarChart>
          ) : (
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={frame == "days" ? "date" : "transactionIndex"}
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                interval="preserveStartEnd"
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="PnL" fill="var(--color-PnL)" radius={8} />
            </LineChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}
