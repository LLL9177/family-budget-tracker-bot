import { createContext } from "react";

export const AuthContext = createContext({
    access: '',
    setAccess: (value: string) => {}
});
