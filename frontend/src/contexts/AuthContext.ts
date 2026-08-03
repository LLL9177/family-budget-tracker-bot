import { createContext } from "react";

type AuthContextType = {
  access: string;
  setAccess: (value: string) => void;
};

export const AuthContext = createContext<AuthContextType>({
  access: "",
  setAccess: () => {},
});
