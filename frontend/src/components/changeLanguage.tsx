import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function ChangeLanguage({ route, className, iconClass }) {
  return (
    <Link to={route}>
      <Button className={className}>
        <Globe className={iconClass} />
      </Button>
    </Link>
  );
}
