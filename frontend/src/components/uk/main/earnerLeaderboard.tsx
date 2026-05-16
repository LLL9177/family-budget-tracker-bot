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

export default function EarnerLeaderboard_uk({ topEarners }: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-t from-primary/5 to-card p-1">
      {topEarners ? (
        <Table>
          <TableCaption>Топ заробітників</TableCaption>
          <TableHeader>
            <TableHead>Позиція</TableHead>
            <TableHead>Зароблено</TableHead>
            <TableHead>Ім'я користувача</TableHead>
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
        <span>НЕМАЄ ЗАРОБІТНИКІВ</span>
      )}
    </div>
  );
}
