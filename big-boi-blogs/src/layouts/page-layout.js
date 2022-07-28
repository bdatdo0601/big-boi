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

const getBlogsSite = (currentRoute = "") =>
  window.location.hostname === "localhost"
    ? `http://localhost:8000${currentRoute}`
    : `https://blogs.datbdo.com${currentRoute}`;

const getMainSite = (currentRoute = "") =>
  window.location.hostname === "localhost"
    ? `http://localhost:3000/blogs${currentRoute}`
    : `https://datbdo.com/blogs${currentRoute}`;

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
              </Fragment>
            );
          }}
        </Location>
        <Box sx={{ textAlign: "right" }}>
          <Themed.a
            sx={{ textDecoration: "none", cursor: "pointer" }}
            href={!isIframe() && getMainSite(window.location.pathname)}
            onClick={e => {
              if (isIframe()) {
                window.parent.postMessage(
                  JSON.stringify({
                    site: { name, description, keywords, siteUrl, siteImage, lang },
                    path: getBlogsSite(window.location.pathname),
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
        {children}
      </Main>
    </ContextProvider>
  );
};

export default PageLayout;
