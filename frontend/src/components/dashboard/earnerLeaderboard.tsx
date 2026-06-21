import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  topEarners: [string, number][] | undefined;
};

export default function EarnerLeaderboard({ topEarners }: Props) {
  return (
    <div className="overflox-x-scroll max-w-120 rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card p-1 pb-2">
      {topEarners ? (
        <Table>
          <TableCaption>Top Earners</TableCaption>
          <TableHeader>
            <TableHead>Position</TableHead>
            <TableHead>Earnt</TableHead>
            <TableHead>Username</TableHead>
          </TableHeader>
          <TableBody>
            {topEarners.map((user, i) => (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user[1]}</TableCell>
                <TableCell>{user[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>NO EARNERS</span>
      )}
    </div>
  );
}
