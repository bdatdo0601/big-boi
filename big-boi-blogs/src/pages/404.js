import React from "react";
import { Themed } from "theme-ui";
import { Location } from "@reach/router";

import { PageElement } from "../components/page-element";
import { useConfig } from "../data/use-config";
import PageLayout from "../layouts/page-layout";
import { isIframe } from "../utils";
import { FaHome } from "react-icons/fa";

const Error = () => {
  const {
    site: {
      siteMetadata: { name, description, keywords, siteUrl, siteImage, lang },
    },
  } = useConfig();
  return (
    <PageElement>
      <PageLayout>
        <Location>
          {({ location }) => {
            const blogSite = location.hostname === "localhost" ? `http://localhost:8000` : `https://blogs.datbdo.com`;
            return (
              <React.Fragment>
                <Themed.h1> 404 page not found </Themed.h1>
                <Themed.h3>
                  <Themed.a
                    sx={{ textDecoration: "none", cursor: "pointer" }}
                    href={blogSite}
                    onClick={e => {
                      if (isIframe()) {
                        window.parent.postMessage(
                          JSON.stringify({
                            site: {
                              name,
                              description,
                              keywords,
                              siteUrl,
                              siteImage,
                              lang,
                            },
                            path: "/",
                            navigateToPath: true,
                          }),
                          "*"
                        );
                        e.preventDefault();
                      }
                    }}
                  >
                    Go Home <FaHome />
                  </Themed.a>
                </Themed.h3>
              </React.Fragment>
            );
          }}
        </Location>
      </PageLayout>
    </PageElement>
  );
};

export default Error;
