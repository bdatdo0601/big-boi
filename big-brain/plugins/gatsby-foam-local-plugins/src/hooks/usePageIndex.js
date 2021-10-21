import { graphql, useStaticQuery } from 'gatsby';

const getHref = (relativePath) => {
  let href = relativePath.replace(/(\.mdx)|(\.md)/g, '');
  // pages from subdir must add leading slash
  if (href.match(/\//g) > 0 && href.charAt(0) !== '/') {
    href = `/${href}`;
  }
  return href;
};

const usePageIndex = () => {
  const data = useStaticQuery(graphql`
    {
      allFile(filter: { ext: { in: [".md", ".mdx"] } }) {
        nodes {
          name
          relativePath
          fields {
            title
          }
          childMdx {
            body
          }
        }
      }
    }
  `);

  const pages = data.allFile.nodes.map((node) => ({
    name: node.name,
    href: getHref(node.relativePath),
    title: node.fields.title,
    mdx: node.childMdx.body,
  }));

  const getPage = (pageName) => pages.find((p) => p.name === pageName);

  return { pages, getPage };
};

export default usePageIndex;
