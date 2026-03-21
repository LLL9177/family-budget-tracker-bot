import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

export default function ChangeLanguage() {
  const { i18n } = useTranslation();

  return (
    <div>
      <Button
        className="h-10 w-10 relative left-[450%] top-8"
        onClick={() => {i18n.changeLanguage(i18n.language == "en" ? "uk" : "en")}}
      >
        <Globe className="!w-6 !h-6" />
      </Button>
    </div>
  );
}
