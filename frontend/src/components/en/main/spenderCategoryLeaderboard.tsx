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

export default function SpenderCategoryLeaderboard_en({
  topSpenderCategories,
}: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-t from-primary/5 to-card p-1">
      {topSpenderCategories ? (
        <Table>
          <TableCaption>Top Spender Categories</TableCaption>
          <TableHeader>
            <TableHead>Position</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Category name</TableHead>
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
        <span>NO SPENDER CATEGORIES</span>
      )}
    </div>
  );
}
