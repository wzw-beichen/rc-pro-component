import { createContext } from "react";

export const TransmitContext = createContext<Record<string, any> | undefined>(
  {}
);
