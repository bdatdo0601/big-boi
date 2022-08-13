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
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: 'https://datbdo.us12.list-manage.com/subscribe/post?u=fa8193682bc7f355d2d565c2f&id=8779558f85', // string; add your MC list endpoint here; see instructions below
        timeout: 3500, // number; the amount of time, in milliseconds, that you want to allow mailchimp to respond to your request before timing out. defaults to 3500
      },
    },
  ]
}
