import { graphql, useStaticQuery } from 'gatsby';
import React, { memo } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { LinkToStacked } from 'react-stacked-pages-hook';
import classNames from '../utils/classNames';
// returns an object that mimics the path structure of the pages
function getPathStructure(pages) {
  const structure = {};

  // https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
  const setDeep = ({ displayPath, displayName, linkPath }) => {
    let schema = structure; // a moving reference to internal objects within obj
    const pList = displayPath.split('/');
    const len = pList.length;
    for (let i = 0; i < len - 1; i += 1) {
      const elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    const indexName = pList[len - 1] || '/';
    schema[indexName] = { type: 'file', displayName, linkPath };
  };

  for (let i = 0; i < pages.length; i += 1) {
    // remove leading /
    const displayPath = pages[i].slug.replace(/^\//, '');

    const page = {
      displayPath,
      displayName: pages[i].title,
      linkPath: pages[i].slug,
    };
    setDeep(page);
  }

  return structure;
}

const FolderDisplay = ({ title, open }) => (
  <div className="w-full flex items-center">
    <ChevronRightIcon
      className={classNames(
        'w-4 h-4 mx-2 text-skin-icon',
        open ? 'rotate-90' : null
      )}
    />
    {title}
  </div>
);

const FileDisplay = ({ file }) => (
  <LinkToStacked
    to={file.linkPath}
    className="block m-1 py-1 rounded hover:bg-skin-sidebar-hover focus:outline-none focus:ring-1 focus:ring-skin-base"
  >
    <div className="flex items-center ">
      <DocumentTextIcon className="w-4 h-4 mx-2 text-skin-icon" />
      {file.displayName}
    </div>
  </LinkToStacked>
);

const PageEntriesDisplay = ({ object, title = null }) => {
  const keys = Object.keys(object);

  const sortOrder = (key) => {
    if ('type' in object[key]) return -1;
    return 0;
  };

  const sortedKeys = keys.sort((a, b) => {
    if (sortOrder(b) < sortOrder(a)) return -1;
    if (object[a].displayName < object[b].displayName) return -1;
    return 1;
  });

  const contents = (
    <>
      {sortedKeys.map((key) => (
        <div key={key}>
          {'type' in object[key] ? (
            <FileDisplay file={object[key]} />
          ) : (
            <PageEntriesDisplay object={object[key]} title={key} />
          )}
        </div>
      ))}
    </>
  );

  if (!title) {
    return contents;
  }
  return (
    <Disclosure>
      {({ open }) => (
        <div className="m-1">
          <Disclosure.Button className="py-1 w-full rounded hover:bg-skin-sidebar-hover focus:outline-none focus:ring-1 focus:ring-skin-base">
            <FolderDisplay title={title} open={open} />
          </Disclosure.Button>
          <Disclosure.Panel className="ml-3">{contents}</Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

const PageList = ({ data }) => {
  const pages = data?.allFile?.nodes?.map(({ fields }) => ({
    slug: fields.slug,
    title: fields.title,
  }));

  const pathStructure = getPathStructure(pages);

  return <PageEntriesDisplay object={pathStructure} />;
};

const MemoPageList = memo(PageList);

const PageIndexSidebar = ({ sideBarOpen }) => {
  const data = useStaticQuery(graphql`
    query allUserSites {
      allFile(filter: { ext: { in: [".md", ".mdx"] } }) {
        nodes {
          fields {
            slug
            title
          }
        }
      }
    }
  `);

  return (
    <aside
      aria-hidden={!sideBarOpen}
      className={classNames(
        'overflow-y-auto flex-shrink-0 bg-skin-sidebar text-sm text-skin-base select-none border-r border-skin-base transition-all motion-reduce:transition-none',
        sideBarOpen ? 'w-3/4 md:w-1/2 lg:w-1/3 2xl:w-96' : 'w-0'
      )}
    >
      <div style={{ visibility: sideBarOpen ? 'visible' : 'hidden' }}>
        <MemoPageList data={data} />
      </div>
    </aside>
  );
};

export default PageIndexSidebar;
