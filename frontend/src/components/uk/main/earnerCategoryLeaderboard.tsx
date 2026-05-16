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
  topEarnerCategories: [string, number][] | undefined;
};

export default function EarnerCategoryLeaderboard_uk({
  topEarnerCategories,
}: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-t from-primary/5 to-card p-1">
      {topEarnerCategories ? (
        <Table>
          <TableCaption>Топ заробляючих категорій</TableCaption>
          <TableHeader>
            <TableHead>Позиція</TableHead>
            <TableHead>Зароблено</TableHead>
            <TableHead>Назва категорії</TableHead>
          </TableHeader>
          <TableBody>
            {topEarnerCategories.map((category, i) => (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{category[1]}</TableCell>
                <TableCell>{category[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>НЕМАЄ ЗАРОБЛЯЮЧИХ КАТЕГОРІЙ</span>
      )}
    </div>
  );
}
