import { get } from 'lodash';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.css';
import IframeResizer from '@iframe-resizer/react';
import { Seo } from '../../components/SEO';

const blogURL = 'https://blogs.datbdo.com';

export default function Blogs() {
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentData, setCurrentData] = useState({ site: { name: "Dat Do's Blogs and Thoughts" }, path: '/' });
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
              navigate(`/blogs${decoded.path}`);
            }
          }
        }
      } catch (_err) {
        /* empty */
      }
    };

    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [navigate]);
  const titleTemplate = useMemo(() => location.pathname.replace(/\//gm, ''), [location]);

  return (
    <>
      <Seo
        type="website"
        title={get(currentData, 'site.name')}
        titleTemplate={titleTemplate}
        description={get(currentData, 'site.description', '')}
        siteUrl={get(currentData, 'site.siteUrl', window.location.origin)}
        canonical={get(currentData, 'site.pathname', location.pathname)}
        image={get(currentData, 'site.siteImage')}
        path={get(currentData, 'site.pathname', location.pathname)}
        keywords={get(currentData, 'site.keywords', [''])}
        lang={get(currentData, 'site.lang', 'en')}
      />
      <IframeResizer
        license="GPLv3"
        id="iframe"
        title="Blog Page"
        src={`${blogURL}${location.pathname}`}
        className="grow"
        ref={e => {
          iframeRef.current = e;
        }}
        scrolling="omit"
        waitForload
      />
    </>
  );
}
