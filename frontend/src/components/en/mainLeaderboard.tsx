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
  prev: IMonthlySummary;
  current: {
    pnl: number;
    totalSpent: number;
    totalEarned: number;
    topCategory?: string;
    topSpender?: string;
    topEarner?: string;
  };
};

export default function MainLeaderboard_en({ data }: Props) {
  return (
    <div className="mt-2.5 ml-3 w-[100vh]">
      <Table className="h-full overflow-scroll bg-gradient-to-t from-primary/5 to-card">
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
          </TableRow>
          <TableRow>
            <TableCell>Total spent</TableCell>
            <TableCell>{data.current.totalSpent}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total earnt</TableCell>
            <TableCell>{data.current.totalEarned}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top category</TableCell>
            <TableCell>{data.current.topCategory ?? "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top spender</TableCell>
            <TableCell>{data.current.topSpender ?? "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Top earner</TableCell>
            <TableCell>{data.current.topEarner ?? "-"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
