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
  data: {
    prev?: IMonthlySummary;
    current?: {
      pnl: number;
      totalSpent: number;
      totalEarned: number;
      mostSpentOn?: string;
      mostEarnedFrom?: string;
      topSpender?: string;
      topEarner?: string;
    };
  } | undefined;
};

export default function LastMonthComparison_en({ data }: Props) {
  if (!data) return null;
  if (!data.current || !data.prev) return null;

  return (
    <div className="w-full h-87 mt-2 bg-gradient-to-t from-primary/5 to-card rounded-xl">
      <Table className="h-full overflow-x-scroll bg-[rgba(0,0,0,0)]">
        <TableCaption>Last Month Comparison</TableCaption>
        <TableHeader>
          <TableHead>Property</TableHead>
          <TableHead>This month</TableHead>
          <TableHead>Last month</TableHead>
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
            <TableCell>{data.prev.monstEarnedFrom ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top spender</TableCell>
            <TableCell>{data.current.topSpender ?? "-"}</TableCell>
            <TableCell> {data.prev.topSpenderId ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top earner</TableCell>
            <TableCell>{data.current.topEarner ?? "-"}</TableCell>
            <TableCell>{data.prev.topEarnerId ?? "-"}</TableCell>
            <TableCell>Uncomparable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
