import { AuthContext } from "@/contexts/AuthContext";
import { FamilyContext } from "@/contexts/FamilyContext";

import {
  CategoryUsedInEnum,
  type CategoryUsedInEnum as CategoryUsedIn,
} from "@/enums/CategoryUserIn.enum";

import { CategoryTypeEnum } from "@/enums/CategoryType.enum";

import { useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Tags,
  Lock,
  Pencil,
  Save,
  X,
  Trash2,
  Wallet,
  TrendingUp,
  ArrowDownUp,
  Globe2,
  FolderPlus,
  Loader2,
} from "lucide-react";

import Navigation from "../navigation/navigation";
import type { ICategory } from "@/types/Category.interface";
import type { IUser } from "@/types/User.interface";

const i18n = {
  en: {
    title: "Categories",
    description:
      "Organize where your money goes. Or at least give the chaos proper names.",

    yourCategories: "Your Categories",
    yourCategoriesDescription:
      "Categories created specifically for your family.",

    globalCategories: "Global Categories",
    globalCategoriesDescription:
      "Built into the system. Look, but don't touch.",

    english: "English",
    ukrainian: "Українська",
    usedIn: "Used in",

    earning: "Earning",
    payment: "Payment",
    both: "Both",

    edit: "Edit",
    save: "Save changes",
    cancel: "Cancel",

    immutable: "🔒 Immutable",
    custom: "✦ Custom",

    total: "Total",
    global: "Global",
    editable: "Editable",

    noCategories: "No categories yet",
    noCategoriesDescription:
      "Your budget is currently living without labels. Dangerous.",

    addCategory: "Add category",
    saving: "Saving...",

    managedByApplication: "Managed by the application",
    customFamilyCategory: "Custom family category",
  },
  uk: {
    title: "Категорії",
    description:
      "Організуйте свої фінанси. Або хоча б дайте цьому хаосу нормальні назви.",

    yourCategories: "Ваші категорії",
    yourCategoriesDescription:
      "Категорії, створені спеціально для вашої сім'ї.",

    globalCategories: "Глобальні категорії",
    globalCategoriesDescription:
      "Вбудовані в систему. Дивитися можна, змінювати — ні.",

    english: "Англійська",
    ukrainian: "Українська",
    usedIn: "Використовується для",

    earning: "Доходи",
    payment: "Витрати",
    both: "Обидва",

    edit: "Редагувати",
    save: "Зберегти зміни",
    cancel: "Скасувати",

    immutable: "Незмінна",
    custom: "Власна",

    total: "Усього",
    global: "Глобальні",
    editable: "Редаговані",

    noCategories: "Категорій поки немає",
    noCategoriesDescription:
      "Ваш бюджет зараз живе без категорій. Небезпечна територія.",

    addCategory: "Додати категорію",
    saving: "Збереження...",

    managedByApplication: "Керується застосунком",
    customFamilyCategory: "Власна категорія сім'ї",
  },
};

interface CategoryCardProps {
  category: ICategory;
  immutable?: boolean;
  onSave?: (category: ICategory) => Promise<void>;
  onDelete?: (category: ICategory) => Promise<void>;
}

function CategoryCard({
  category,
  immutable = false,
  onSave,
  onDelete,
}: CategoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editedCategory, setEditedCategory] = useState<ICategory>(category);
  const [deleting, setDeleting] = useState(false);

  const t = i18n[localStorage.getItem("lang") === "en" ? "en" : "uk"];

  useEffect(() => {
    setEditedCategory(category);
  }, [category]);

  async function handleDelete() {
    if (!onDelete) return;

    try {
      setDeleting(true);
      await onDelete(category);
    } finally {
      setDeleting(false);
    }
  }

  const hasChanges =
    editedCategory.eng !== category.eng ||
    editedCategory.ukr !== category.ukr ||
    editedCategory.usedIn !== category.usedIn;

  function getUsedInData(usedIn: CategoryUsedIn) {
    switch (usedIn) {
      case CategoryUsedInEnum.EARNING:
        return {
          icon: TrendingUp,
          label: t.earning,
        };

      case CategoryUsedInEnum.PAYMENT:
        return {
          icon: Wallet,
          label: t.payment,
        };

      case CategoryUsedInEnum.BOTH:
        return {
          icon: ArrowDownUp,
          label: t.both,
        };
    }
  }

  const usedInData = getUsedInData(category.usedIn);
  const UsedInIcon = usedInData.icon;

  function cancelEdit() {
    setEditedCategory(category);
    setEditing(false);
  }

  async function handleSave() {
    if (!onSave || !hasChanges) return;

    try {
      setSaving(true);

      await onSave(editedCategory);

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="group rounded-3xl border bg-muted/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* CATEGORY INFO */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              {immutable ? (
                <Lock className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Tags className="h-6 w-6 text-primary" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-bold">{category.eng}</h3>

                {immutable && (
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>

              <p className="truncate text-sm text-muted-foreground">
                {category.ukr}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          {!immutable && !editing && (
            <div className="flex shrink-0 gap-1 opacity-0 transition-all group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setEditing(true)}
                disabled={deleting}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator className="my-5" />

        {!editing ? (
          <>
            {/* CATEGORY TYPE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UsedInIcon className="h-4 w-4" />
                {t.usedIn}
              </div>

              <Badge variant="secondary" className="rounded-full px-3">
                {usedInData.label}
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {immutable ? t.managedByApplication : t.customFamilyCategory}
              </p>

              <Badge
                variant={immutable ? "outline" : "secondary"}
                className="rounded-full"
              >
                {immutable ? t.immutable : t.custom}
              </Badge>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2">
              <label>{t.english}</label>

              <Input
                value={editedCategory.eng}
                onChange={(e) =>
                  setEditedCategory((prev) => ({
                    ...prev,
                    eng: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <label>{t.ukrainian}</label>

              <Input
                value={editedCategory.ukr}
                onChange={(e) =>
                  setEditedCategory((prev) => ({
                    ...prev,
                    ukr: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <label>{t.usedIn}</label>

              <Select
                value={editedCategory.usedIn}
                onValueChange={(value) =>
                  setEditedCategory((prev) => ({
                    ...prev,
                    usedIn: value as CategoryUsedIn,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={CategoryUsedInEnum.EARNING}>
                    {t.earning}
                  </SelectItem>

                  <SelectItem value={CategoryUsedInEnum.PAYMENT}>
                    {t.payment}
                  </SelectItem>

                  <SelectItem value={CategoryUsedInEnum.BOTH}>
                    {t.both}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={cancelEdit}
                disabled={saving}
              >
                <X className="mr-2 h-4 w-4" />
                {t.cancel}
              </Button>

              <Button
                className="flex-1 rounded-xl"
                disabled={!hasChanges || saving}
                onClick={handleSave}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {t.save}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Categories() {
  const auth = useContext(AuthContext);
  const familyContext = useContext(FamilyContext);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const t = i18n[localStorage.getItem("lang") === "en" ? "en" : "uk"];

  const [user, setUser] = useState<IUser | null>(null);

  /*
   * Fetch categories separately.
   *
   * The family is only used for things like the banner.
   * Categories are now completely independent from FamilyContext.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/category/get/by_user",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
            },
          }
        );

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data: ICategory[] = await res.json();

        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (auth.access) {
      fetchData();
    }
  }, [auth.access]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: auth.access ? `Bearer ${auth.access}` : "",
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = await res.json();

        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (auth.access) {
      fetchProfile();
    }
  }, [auth.access]);

  async function saveCategory(updatedCategory: ICategory) {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/category/update`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.access ? `Bearer ${auth.access}` : "",
        },
        body: JSON.stringify({
          id: updatedCategory.id,
          eng: updatedCategory.eng,
          ukr: updatedCategory.ukr,
          usedIn: updatedCategory.usedIn,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const savedCategory: ICategory = await res.json();

    setCategories((prev) =>
      prev.map((category) =>
        category.id === savedCategory.id ? savedCategory : category
      )
    );
  }

  async function deleteCategory(category: ICategory) {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/category/delete`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.access ? `Bearer ${auth.access}` : "",
        },
        body: JSON.stringify({
          id: category.id,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    setCategories((prev) => prev.filter((item) => item.id !== category.id));
  }

  const localCategories = categories.filter(
    (category) => category.type === CategoryTypeEnum.LOCAL
  );

  const globalCategories = categories.filter(
    (category) => category.type === CategoryTypeEnum.GLOBAL
  );

  const family = familyContext.family;

  const isOwner = family?.owner?.id === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-72 w-full rounded-[32px]" />

          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-[32px]" />
            <Skeleton className="h-48 rounded-[32px]" />
            <Skeleton className="h-48 rounded-[32px]" />
          </div>

          <Skeleton className="h-[500px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* PAGE BACKGROUND */}
      {family?.banner?.url && (
        <>
          <img
            src={family.banner.url}
            alt=""
            className="pointer-events-none fixed inset-0 h-full w-full scale-110 object-cover opacity-20 blur-sm"
          />

          <div className="pointer-events-none fixed inset-0 -z-10 bg-black/70" />
        </>
      )}

      <Navigation exclude="categories" />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* HERO */}
        <div className="group relative overflow-hidden rounded-[32px] border shadow-2xl">
          {/* HERO BANNER */}
          <img
            src={family?.banner?.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* HERO OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

          {/* GLOW */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          {/* HERO CONTENT */}
          <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row lg:items-end lg:justify-between lg:p-12">
            {/* TITLE */}
            <div className="space-y-5 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border-none bg-white/15 px-4 py-1 text-white backdrop-blur-xl">
                  <Tags className="mr-2 h-4 w-4" />
                  {t.title}
                </Badge>

                <Badge className="rounded-full border-none bg-white/15 px-4 py-1 text-white backdrop-blur-xl">
                  <Globe2 className="mr-2 h-4 w-4" />
                  {globalCategories.length} {t.global}
                </Badge>
              </div>

              <div>
                <h1 className="text-5xl font-black tracking-tight lg:text-7xl">
                  {t.title}
                </h1>

                <p className="mt-3 max-w-2xl text-lg text-zinc-300">
                  {t.description}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-3xl border-white/10 bg-white/10 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-300">{t.total}</p>

                  <h2 className="mt-1 text-3xl font-black">
                    {categories.length}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-white/10 bg-white/10 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-300">{t.editable}</p>

                  <h2 className="mt-1 text-3xl font-black">
                    {localCategories.length}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-white/10 bg-white/10 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-300">{t.global}</p>

                  <h2 className="mt-1 text-3xl font-black">
                    {globalCategories.length}
                  </h2>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
          {/* LOCAL CATEGORIES */}
          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3 text-3xl font-black">
                    <Tags className="h-7 w-7" />

                    {t.yourCategories}
                  </CardTitle>

                  <CardDescription className="mt-2">
                    {t.yourCategoriesDescription}
                  </CardDescription>
                </div>

                <Badge className="rounded-full px-4 py-2">
                  {localCategories.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {localCategories.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {localCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onSave={saveCategory}
                      onDelete={isOwner ? deleteCategory : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed p-12 text-center">
                  <FolderPlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

                  <h3 className="font-bold">{t.noCategories}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.noCategoriesDescription}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GLOBAL CATEGORIES */}
          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <Lock className="h-6 w-6" />

                {t.globalCategories}
              </CardTitle>

              <CardDescription>{t.globalCategoriesDescription}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {globalCategories.map((category) => (
                <CategoryCard key={category.id} category={category} immutable />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
