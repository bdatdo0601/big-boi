import React from "react";

const DOCUMENTATION_URL = "https://docs.datbdo.com/";

// 64 pixels are height of nav bar
export default function Documentations() {
  return (
    <div style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
      <iframe title="Documentation" src={DOCUMENTATION_URL} width="100%" height="100%" />
    </div>
  );
}
