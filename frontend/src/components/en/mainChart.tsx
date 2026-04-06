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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import type { ITransactionWithDate } from "@/types/TransactionWithDate.interface";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTheme } from "../theme-provider";
import { BarChart3, LineChart as LineChartIcon } from "lucide-react";

const chartConfig = {
  PnL: {
    label: "PnL",
    color: "#2cddb7",
  },
} satisfies ChartConfig;

type Props = {
  data: ITransactionWithDate[];
};

export default function MainChart({ data }: Props) {
  const [displayMode, setDisplayMode] = useState("bars");
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  console.log(currentTheme);

  const [frame, setFrame] = useState("days");

  const chartData = [];
  const loopedDays = [];
  let pnl = 0;
  for (const transaction of data) {
    const today = new Date();
    if (
      transaction.createdAt.getMonth() == today.getMonth() &&
      transaction.createdAt.getFullYear() == today.getFullYear()
    ) {
      const day = transaction.createdAt.getDate();
      if (frame == "days") {
        if (loopedDays.includes(day)) continue;
        data.map((t: ITransactionWithDate) => {
          if (
            t.createdAt.getDate() == day &&
            data.indexOf(t) !== data.indexOf(transaction)
          ) {
            pnl += t.amount;
            loopedDays.push(t.createdAt.getDate());
            return t;
          }
        });
        chartData.push({ date: `Day ${day}`, PnL: pnl });
      } else if (frame == "transactions") {
        chartData.push({ transactionIndex: "0", PnL: pnl, date: `Day ${day}` }); // date here is to be able to sort
      }
      pnl += transaction.amount;
    }
  }

  chartData.sort((a, b) => {
    const dayA = parseInt(a.date.replace("Day ", ""));
    const dayB = parseInt(b.date.replace("Day ", ""));
    return dayA - dayB;
  });

  if (frame == "transactions") {
    let transactionIndex = 0;
    for (const t of chartData) {
      transactionIndex++;
      t.transactionIndex = String(transactionIndex);
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`h-200 w-350 rounded-[30px] border-[rgb(100,100,100)] border-1 ${
          currentTheme == "dark"
            ? "bg-[rgba(255,255,255,0.05)]"
            : "bg-[rgba(0,0,0,0.03)]"
        } p-10`}
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
          className="max-h-160 w-full rounded-xl border-1 p-10 pt-15"
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
