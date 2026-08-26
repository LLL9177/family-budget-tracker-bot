import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ICategory } from "@/types/Category.interface";

type Props = {
  topEarnerCategories: [string, number][] | undefined;
};

const i18n = {
  en: {
    caption: "Top Earner Categories",
    position: "Position",
    earned: "Earned",
    categoryName: "Category",
    noCategories: "No earner categories",
  },
  uk: {
    caption: "Категорії з найбільшими доходами",
    position: "Позиція",
    earned: "Зароблено",
    categoryName: "Категорія",
    noCategories: "Немає категорій доходів",
  },
};

export default function EarnerCategoryLeaderboard({
  topEarnerCategories,
}: Props) {
  const lang = localStorage.getItem("lang") == "en" ? "en" : "uk";
  const t = i18n[lang];

  function getCategoryName(category: ICategory | string) {
    if (typeof category == "string") return category;
    if (!category) return "None";

    return lang === "en" ? category.eng : category.ukr;
  }

  return (
    <div className="overflox-x-scroll max-w-120 rounded-xl bg-card bg-gradient-to-t from-primary/5 to-card p-1 pb-2">
      {topEarnerCategories ? (
        <Table>
          <TableCaption>{t.caption}</TableCaption>
          <TableHeader>
            <TableHead>{t.position}</TableHead>
            <TableHead>{t.earned}</TableHead>
            <TableHead>{t.categoryName}</TableHead>
          </TableHeader>
          <TableBody>
            {topEarnerCategories.map((category, i) => (
              <TableRow>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{category[1]}</TableCell>
                <TableCell>{getCategoryName(category[0])}</TableCell>
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
