const path = require(`path`);
const slugify = require("slugify");

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
  const result = await graphql(`
    query {
      allBlogPost {
        nodes {
          data {
            attributes {
              archived
              createdAt
              host
              id
              idUrl
              type
              title
              updatedAt
              url
            }
            embed
            link
            text
            tweetID
            type
            url
            username
          }
          createdAt
          description
          externalLink
          id
          owner
          postType
          status
          tags
          title
          updatedAt
        }
        pageInfo {
          perPage
        }
      }
    }
  `);
  await Promise.all(
    result.data.allBlogPost.nodes
      .filter(node => !node.postType)
      .map(async node => {
        const pageData = {
          path: `${slugify(node.title)}`,
          component: blogPostTemplate,
          context: {
            title: node.title,
            data: node,
          },
        };

        await createPage(pageData);
      })
  );
};
