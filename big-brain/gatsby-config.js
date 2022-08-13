module.exports = {
  siteMetadata: {
    title: `The Documentations [Big Brain Project]`,
    description: `Place to document all research, architecture, best practices, etc`
  },
  plugins: [
    "gatsby-plugin-theme-ui",
    {
      resolve: `gatsby-foam-local-plugins`,
      options: {
        contentPath: `${__dirname}/src/content`,
        rootNote: "Documents/Welcome",
        ignore: ["**/private/**/*"]
      }
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
          origin: "https://www.googletagmanager.com",
        },
      },
    },
  ]
}
