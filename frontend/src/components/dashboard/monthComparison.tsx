import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IMonthlySummary } from "@/types/MonthlySummary.interface";

type Props = {
  data:
    | {
        prev?: IMonthlySummary;
        current?: IMonthlySummary;
      }
    | undefined;
  caption: string;
  monthOneName: string;
  monthTwoName: string;
};

const i18n = {
  en: {
    property: "Property",
    pnl: "PnL",
    totalSpent: "Total spent",
    totalEarned: "Total earned",
    topSpentOn: "Top spent on",
    mostEarnedFrom: "Most earned from",
    topSpender: "Top spender",
    topEarner: "Top earner",
    difference: "Difference",
    uncomparable: "Uncomparable",
  },
  uk: {
    property: "Показник",
    pnl: "Прибуток/збиток",
    totalSpent: "Всього витрачено",
    totalEarned: "Всього зароблено",
    topSpentOn: "Найбільші витрати на",
    mostEarnedFrom: "Найбільший дохід з",
    topSpender: "Найбільший витратник",
    topEarner: "Найбільший заробітчанин",
    difference: "Різниця",
    uncomparable: "Не порівнюється",
  },
};

export default function MonthComparison({
  data,
  caption,
  monthOneName,
  monthTwoName,
}: Props) {
  if (!data) return null;
  if (!data.current || !data.prev) return null;

  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  return (
    <div className="mt-2 h-87 w-full rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card">
      <Table className="h-full overflow-x-scroll bg-[rgba(0,0,0,0)]">
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableHead>{t.property}</TableHead>
          <TableHead>{monthOneName}</TableHead>
          <TableHead>{monthTwoName}</TableHead>
          <TableHead>{t.difference}</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{t.pnl}</TableCell>
            <TableCell>{data.current.pnl}</TableCell>
            <TableCell>{data.prev.pnl}</TableCell>
            <TableCell>{data.current.pnl - data.prev.pnl}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t.totalSpent}</TableCell>
            <TableCell>{-data.current.totalSpent}</TableCell>
            <TableCell>{-data.prev.totalSpent}</TableCell>
            <TableCell>
              {data.current.totalSpent - data.prev.totalSpent}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t.totalEarned}</TableCell>
            <TableCell>{data.current.totalEarned}</TableCell>
            <TableCell>{data.prev.totalEarned}</TableCell>
            <TableCell>
              {data.current.totalEarned - data.prev.totalEarned}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t.topSpentOn}</TableCell>
            <TableCell>{data.current.mostSpentOn ?? "-"}</TableCell>
            <TableCell>{data.prev.mostSpentOn ?? "-"}</TableCell>
            <TableCell>{t.uncomparable}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t.mostEarnedFrom}</TableCell>
            <TableCell>{data.current.mostEarnedFrom ?? "-"}</TableCell>
            <TableCell>{data.prev.mostEarnedFrom ?? "-"}</TableCell>
            <TableCell>{t.uncomparable}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t.topSpender}</TableCell>
            <TableCell>{data.current.topSpenderId ?? "-"}</TableCell>
            <TableCell> {data.prev.topSpenderId ?? "-"}</TableCell>
            <TableCell>{t.uncomparable}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t.topEarner}</TableCell>
            <TableCell>{data.current.topEarnerId ?? "-"}</TableCell>
            <TableCell>{data.prev.topEarnerId ?? "-"}</TableCell>
            <TableCell>{t.uncomparable}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
