import React, { createContext } from "react";

export const ResumeContext = createContext({});

export const ResumeProvider = ({ resume, children }) => (
  <ResumeContext.Provider value={{ resume }}>{children}</ResumeContext.Provider>
);
