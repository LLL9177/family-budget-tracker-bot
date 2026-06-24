import type { LucideIcon } from "lucide-react";

export interface ITutorialBlockPlain {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ITutorialBlock {
  title: (isLangEn: boolean) => string;
  description: (isLangEn: boolean) => string;
  icon: LucideIcon;
}
