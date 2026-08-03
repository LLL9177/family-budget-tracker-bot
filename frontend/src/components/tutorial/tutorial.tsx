import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { BotTutorialHero } from "./hero";
import { useContext } from "react";
import { FamilyContext } from "@/contexts/FamilyContext";
import Navigation from "../navigation/navigation";
import SectionLayout from "./sections/section-layout";
import {
  getTutorialSection,
  tutorialResource,
} from "../resources/TutorialResource";

export default function Tutorial() {
  const { family } = useContext(FamilyContext);
  const theme = localStorage.getItem("theme");
  const isLangEn = localStorage.getItem("lang") == "en";

  return (
    <div className="w-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={family ? family.banner.url : `/main-background-${theme}.png`}
          className="h-full w-full scale-110 object-cover blur-sm brightness-75"
        />

        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* subtle vignette / glow */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
      </div>
      <Navigation exclude="tutorial" />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-2">
          <BotTutorialHero />
          {tutorialResource.map((_, i) => (
            <SectionLayout
              data={{ ...getTutorialSection(i, isLangEn), count: i + 1 }}
            />
          ))}
        </div>
      </SidebarProvider>
    </div>
  );
}
