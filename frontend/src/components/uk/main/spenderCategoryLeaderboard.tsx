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
  topSpenderCategories: [string, number][] | undefined;
};

export default function SpenderCategoryLeaderboard_uk({
  topSpenderCategories,
}: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-t from-primary/5 to-card p-1">
      {topSpenderCategories ? (
        <Table>
          <TableCaption>Топ витрачаючих категорій</TableCaption>
          <TableHeader>
            <TableHead>Позиція</TableHead>
            <TableHead>Витрачено</TableHead>
            <TableHead>Назва категорії</TableHead>
          </TableHeader>
          <TableBody>
            {topSpenderCategories.map((category, i) => (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{category[1]}</TableCell>
                <TableCell>{category[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>НЕМАЄ ВИТРАЧАЮЧИХ КАТЕГОРІЙ</span>
      )}
    </div>
  );
}
