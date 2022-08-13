import React, { useRef, useEffect, Fragment, useState, useMemo } from "react";
import { get } from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import "./index.less";
import { Seo } from "../../components/SEO";

const blogURL = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://blogs.datbdo.com";

export default function Blogs() {
  const iframeRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
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
            if (decoded.newSite) {
              window.open(decoded.path);
            } else {
              history.push(`/blogs${decoded.path}`);
            }
          }
        }
      } catch (err) {}
    };

    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [history]);
  const titleTemplate = useMemo(() => location.pathname.replace(/\//gm, ""), [location]);

  return (
    <Fragment>
      <Seo
        type="website"
        title={get(currentData, "site.name")}
        titleTemplate={titleTemplate}
        description={get(currentData, "site.description", "")}
        siteUrl={get(currentData, "site.siteUrl", window.location.origin)}
        canonical={get(currentData, "site.pathname", location.pathname)}
        image={get(currentData, "site.siteImage")}
        path={get(currentData, "site.pathname", location.pathname)}
        keywords={get(currentData, "site.keywords", [""])}
        lang={get(currentData, "site.lang", "en")}
      />
      <iframe
        src={`${blogURL}${location.pathname.replace("/blogs", "")}`}
        className="blog-container-div"
        ref={e => {
          iframeRef.current = e;
        }}
      />
    </Fragment>
  );
}
