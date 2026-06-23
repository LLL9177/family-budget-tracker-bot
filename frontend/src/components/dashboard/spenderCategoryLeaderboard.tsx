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

const i18n = {
  en: {
    caption: "Top Spender Categories",
    position: "Position",
    spent: "Spent",
    categoryName: "Category",
    noCategories: "No spender categories",
  },
  uk: {
    caption: "Категорії з найбільшими витратами",
    position: "Позиція",
    spent: "Витрачено",
    categoryName: "Категорія",
    noCategories: "Немає категорій витрат",
  },
};

export default function SpenderCategoryLeaderboard({
  topSpenderCategories,
}: Props) {
  const t = i18n[localStorage.getItem("lang") == "en" ? "en" : "uk"];

  return (
    <div className="overflox-x-scroll max-w-120 rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card p-1 pb-2">
      {topSpenderCategories ? (
        <Table>
          <TableCaption>{t.caption}</TableCaption>
          <TableHeader>
            <TableHead>{t.position}</TableHead>
            <TableHead>{t.spent}</TableHead>
            <TableHead>{t.categoryName}</TableHead>
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
        <span>{t.noCategories}</span>
      )}
    </div>
  );
}
