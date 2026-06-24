import type {
  ITutorialBlock,
  ITutorialBlockPlain,
} from "./TutorialBlock.interface";

export interface ITutorialSection {
  id: string;
  title: (isLangEn: boolean) => string;
  description?: (isLangEn: boolean) => string;
  blocks: ITutorialBlock[];
  tip?: (isLangEn: boolean) => string;
}

export interface ITutorialSectionPlain {
  id: string;
  title: string;
  description?: string;
  blocks: ITutorialBlockPlain[];
  tip?: string;
}
