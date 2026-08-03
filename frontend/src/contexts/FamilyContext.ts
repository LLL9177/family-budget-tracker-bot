import type { IFamily } from "@/types/Family.interface";
import { createContext } from "react";

export const FamilyContext = createContext({
  family: null,
  setFamily: () => {},
} as {
  family: IFamily | null;
  setFamily: (value: IFamily) => void;
});