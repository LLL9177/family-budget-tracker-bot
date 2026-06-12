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

const chartConfig = {
  PnL: {
    label: "PnL",
    color: "#2cddb7",
  },
} satisfies ChartConfig;

type Props = {
  data: ITransactionWithDate[] | ITransaction[];
};

export default function MainChart_en({ data }: Props) {
  const [displayMode, setDisplayMode] = useState("bars");
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [frame, setFrame] = useState("days");

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
            date: `Day ${day}`,
            PnL: running,
          };
        })
      : (() => {
          let running = 0;

          const sorted = [...monthTransactions].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          return sorted.map((t, i) => {
            running += t.amount;

            return {
              transactionIndex: String(i + 1),
              PnL: running,
              date: `Day ${new Date(t.createdAt).getDate()}`,
            };
          });
        })();

  if (frame == "transactions") {
    let transactionIndex = 0;
    for (const t of chartData) {
      transactionIndex++;
      t.transactionIndex = String(transactionIndex);
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div
        className={`h-190 w-350 rounded-[30px] border border-[rgb(100,100,100)] ${
          currentTheme === "dark"
            ? "bg-gradient-to-t from-primary/5 to-card"
            : "bg-gradient-to-t from-primary/5 to-white"
        } bg-card p-10`}
      >
        <div className="flex space-x-[54%] pr-10 pl-10">
          <div>
            <h2 className="mb-2 text-xl font-bold">PnL Of Current Month</h2>
            <span className="text-[rgb(100,100,100)]">
              This month's difference in balance
            </span>
          </div>
          <div className="flex pb-10">
            <div className="mr-10 flex space-x-[10%]">
              <button
                className={`cursor-pointer rounded border-[2px] pr-1 pl-1 hover:bg-gray-200 dark:hover:bg-[rgb(50,50,50)] ${
                  displayMode == "line" ? "border-[rgb(100,100,100)]" : ""
                } `}
                onClick={() => {
                  setDisplayMode("line");
                }}
              >
                <LineChartIcon />
              </button>
              <button
                className={`cursor-pointer rounded border-[2px] pr-1 pl-1 hover:bg-gray-200 dark:hover:bg-[rgb(50,50,50)] ${
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
                  days
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
                  transactions
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="max-h-150 w-full rounded-xl border-1 bg-[rgba(150,150,150,0.1)] p-10 pt-15"
        >
          {displayMode == "bars" ? (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={frame == "days" ? "date" : "transactionIndex"}
                tickLine={false}
                tickMargin={10}
                axisLine={true}
                interval={
                  chartData.length > 30
                    ? Math.floor((chartData.length - 30) / 2)
                    : 0
                }
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
                interval={
                  chartData.length > 30
                    ? Math.floor((chartData.length - 30) / 2)
                    : 0
                }
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
