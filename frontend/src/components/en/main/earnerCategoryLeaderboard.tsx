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

export default function EarnerCategoryLeaderboard_en({
  topEarnerCategories,
}: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-t from-primary/5 to-card p-1 bg-card">
      {topEarnerCategories ? (
        <Table>
          <TableCaption>Top Earner Categories</TableCaption>
          <TableHeader>
            <TableHead>Position</TableHead>
            <TableHead>Earnt</TableHead>
            <TableHead>Category name</TableHead>
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
        <span>NO EARNER CATEGORIES</span>
      )}
    </div>
  );
}
