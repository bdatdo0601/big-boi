/** @jsx jsx */
import { Fragment } from "react";
import { Box, jsx, Themed } from "theme-ui";
import { Location } from "@reach/router";
import { ContextProvider } from "../context";

import { Seo } from "../components/seo";
import { Main } from "../components/main";

import { useConfig } from "../data/use-config";
import { isIframe } from "../utils";
import { FaAngleDoubleRight } from "react-icons/fa";

const PageLayout = ({ children }) => {
  const {
    site: {
      siteMetadata: { name, description, keywords, siteUrl, siteImage, lang },
    },
  } = useConfig();

  return (
    <ContextProvider>
      <Main>
        <Location>
          {({ location }) => {
            const { pathname } = location;
            const titleTemplate = pathname.replace(/\//gm, "");

            const blogSite =
              location.hostname === "localhost"
                ? `http://localhost:8000${location.pathname}`
                : `https://blogs.datbdo.com${location.pathname}`;

            const mainSite =
              location.hostname === "localhost"
                ? `http://localhost:3000/blogs${location.pathname}`
                : `https://datbdo.com/blogs${location.pathname}`;

            return (
              <Fragment>
                <Seo
                  type="website"
                  title={name}
                  titleTemplate={titleTemplate}
                  description={description}
                  siteUrl={siteUrl}
                  canonical={pathname}
                  image={siteImage}
                  path={pathname}
                  keywords={keywords || [""]}
                  lang={lang}
                />
                <Box sx={{ textAlign: "right" }}>
                  <Themed.a
                    sx={{ textDecoration: "none", cursor: "pointer" }}
                    href={!isIframe() ? mainSite : "#"}
                    onClick={e => {
                      if (isIframe()) {
                        window.parent.postMessage(
                          JSON.stringify({
                            site: { name, description, keywords, siteUrl, siteImage, lang },
                            path: blogSite,
                            newSite: true,
                            navigateToPath: true,
                          }),
                          "*"
                        );
                        e.preventDefault();
                      }
                    }}
                  >
                    {isIframe() ? "To blogs site" : "To main site"} <FaAngleDoubleRight />
                  </Themed.a>
                </Box>
              </Fragment>
            );
          }}
        </Location>
        {children}
      </Main>
    </ContextProvider>
  );
};

export default PageLayout;
