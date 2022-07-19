require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    name: "Dat Do Blogs & Thoughts",
    description: "Aggregation of my thoughts from various sources",
    keywords: ["tech", "notion", "life", "career", "personal", "opinionated"],
    siteUrl: "https://blogs.datbdo.com",
    siteImage: "https://blogs.datbdo.com/images/profile.jpg", // pop an image in the static folder to use it as the og:image,
    profileImage: "https://blogs.datbdo.com/images/profile.jpg",
    lang: `eng`,
    config: {
      sidebarWidth: 0, // optional,
      hideNav: true,
    },
  },
  plugins: [
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-emotion",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/profile.jpg",
      },
    },
    {
      resolve: "gatsby-source-dynamodb",
      options: {
        typeName: "BlogPost",
        accessKeyId: process.env.BLOG_AWS_ACCESS_KEY,
        secretAccessKey: process.env.BLOG_AWS_SECRET_KEY,
        region: process.env.BLOG_AWS_REGION,
        params: {
          TableName: process.env.BLOG_DYNAMODB_TABLE_NAME,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-YEVKRQ214M", // Google Analytics / GA
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {},
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Defaults to https://www.googletagmanager.com
          origin: "https://blogs.datbdo.com",
        },
      },
    },
  ],
};
