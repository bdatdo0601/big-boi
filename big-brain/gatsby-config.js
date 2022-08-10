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
    }
  ]
}
