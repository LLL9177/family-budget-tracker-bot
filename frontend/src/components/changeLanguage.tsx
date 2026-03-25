import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type Props = {
  route: string;
  className: string;
  iconClass: string;
};

export default function ChangeLanguage({ route, className, iconClass }: Props) {
  return (
    <Link to={route}>
      <Button className={className + " cursor-pointer"}>
        <Globe className={iconClass} />
      </Button>
    </Link>
  );
}
