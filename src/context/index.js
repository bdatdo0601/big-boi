import React from "react";
import { LayoutContextProvider } from "./layout";

export default function ContextProvider({ children }) {
  return <LayoutContextProvider>{children}</LayoutContextProvider>;
}
