import React, { useRef, useEffect } from "react";
import "./index.less";

const blogURL = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://blogs.datbdo.com";

export default function Blogs() {
  const iframeRef = useRef(null);
  useEffect(() => {
    window.addEventListener("message", function(e) {
      // Get the sent data
      const data = e.data;
      // If you encode the message in JSON before sending them,
      // then decode here
      const decoded = JSON.parse(data);
      window.history.replaceState(null, decoded.site.name, `/blogs${decoded.path}`);
    });
    return () => {
      window.removeEventListener("message");
    };
  }, []);
  return (
    <iframe
      src={`${blogURL}/${window.location.pathname.replace("/blogs", "")}`}
      className="w-full h-screen"
      ref={e => {
        iframeRef.current = e;
      }}
    />
  );
}
