import React, { createContext } from "react";
import { InternalNamePath } from "../type";

export type ListContextProps = {
  getKey: (
    namePath: InternalNamePath
  ) => [InternalNamePath[number], InternalNamePath];
};

const ListContext = createContext<ListContextProps | null>(null);

export default ListContext;
