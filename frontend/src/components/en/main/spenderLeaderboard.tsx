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
  topSpenders: [string, number][] | undefined;
};

export default function SpenderLeaderboard_en({ topSpenders }: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-t from-primary/5 to-card p-1">
      {topSpenders ? (
        <Table>
          <TableCaption>Top Spenders</TableCaption>
          <TableHeader>
            <TableHead>Position</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Username</TableHead>
          </TableHeader>
          <TableBody>
            {topSpenders.map((user, i) => {
              return (
                <TableRow>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{-user[1]}</TableCell>
                  <TableCell>{user[0]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <span>NO SPENDERS</span>
      )}
    </div>
  );
}
