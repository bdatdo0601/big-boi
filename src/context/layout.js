import React, { useState } from "react";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  return (
    <LayoutContext.Provider
      value={{
        layout,
        setLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
