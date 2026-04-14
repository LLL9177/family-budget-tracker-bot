import type { IMonthlySummary } from "@/types/MonthlySummary.interface";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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

export default function MonthComparison_en({ data, caption, monthOneName, monthTwoName }: Props) {
  if (!data) return null;
  if (!data.current || !data.prev) return null;

  return (
    <div className="mt-2 h-87 w-full rounded-xl bg-gradient-to-t from-primary/5 to-card">
      <Table className="h-full overflow-x-scroll bg-[rgba(0,0,0,0)]">
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableHead>Property</TableHead>
          <TableHead>{monthOneName}</TableHead>
          <TableHead>{monthTwoName}</TableHead>
          <TableHead>Difference</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>PnL</TableCell>
            <TableCell>{data.current.pnl}</TableCell>
            <TableCell>{data.prev.pnl}</TableCell>
            <TableCell>{data.current.pnl - data.prev.pnl}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total spent</TableCell>
            <TableCell>{-data.current.totalSpent}</TableCell>
            <TableCell>{-data.prev.totalSpent}</TableCell>
            <TableCell>
              {-data.current.totalSpent - data.prev.totalSpent}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total earned</TableCell>
            <TableCell>{data.current.totalEarned}</TableCell>
            <TableCell>{data.prev.totalEarned}</TableCell>
            <TableCell>
              {data.current.totalEarned - data.prev.totalEarned}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top spent on</TableCell>
            <TableCell>{data.current.mostSpentOn ?? "-"}</TableCell>
            <TableCell>{data.prev.mostSpentOn ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Most earned from</TableCell>
            <TableCell>{data.current.mostEarnedFrom ?? "-"}</TableCell>
            <TableCell>{data.prev.mostEarnedFrom ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top spender</TableCell>
            <TableCell>{data.current.topSpenderId ?? "-"}</TableCell>
            <TableCell> {data.prev.topSpenderId ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top earner</TableCell>
            <TableCell>{data.current.topEarnerId ?? "-"}</TableCell>
            <TableCell>{data.prev.topEarnerId ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
