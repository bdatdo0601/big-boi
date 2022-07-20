import React, { useRef, useEffect, Fragment, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import "./index.less";

const blogURL = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://blogs.datbdo.com";

export default function Blogs() {
  const iframeRef = useRef(null);
  const history = useHistory();
  const [currentData, setCurrentData] = useState({ site: { name: "Dat Do's Blogs and Thoughts" }, path: "/" });
  useEffect(() => {
    const messageHandler = e => {
      // Get the sent data
      const data = e.data;
      // If you encode the message in JSON before sending them,
      // then decode here
      try {
        const decoded = JSON.parse(data);
        if (decoded.site && decoded.path) {
          setCurrentData(decoded);
          if (decoded.navigateToPath && decoded.path) {
            history.push(`/blogs${decoded.path}`);
          }
        }
      } catch (err) {}
    };

    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [history]);
  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{currentData.site.name}</title>
        <link rel="canonical" href={`${window.location.hostname}/blogs${currentData.path}`} />
        <meta name="description" content={currentData.site.description} />
      </Helmet>
      <iframe
        src={`${blogURL}/${window.location.pathname.replace("/blogs", "")}`}
        className="w-full h-screen"
        ref={e => {
          iframeRef.current = e;
        }}
      />
    </Fragment>
  );
}
