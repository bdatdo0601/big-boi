import React, { useCallback, useEffect, useRef, useState } from "react";
import IframeResizer from '@iframe-resizer/react';

const DOCUMENTATION_URL = "https://docs.datbdo.com/docs";

// 64 pixels are height of nav bar
export default function Documentations() {
  return (
      <IframeResizer
        license="GPLv3"
        className="grow"
        title="Documentation"
        src={DOCUMENTATION_URL}
        style={{ width: "100%", height: "100%" }}
        waitForLoad
        scrolling="omit"
      />
  );
}
