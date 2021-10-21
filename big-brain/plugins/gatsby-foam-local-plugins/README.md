# Gatsby Philipps Foam Theme

My customized Gatsby theme specifically for [Foam](https://foambubble.github.io/foam/).

Forked from [mathieudutour/gatsby-digital-garden](https://github.com/mathieudutour/gatsby-digital-garden) who did all the major work.

Changes made to original:

- Codeblocks with Codemirror 6
- Upped deps (Gatsby 3)
- Adopted Tailwind for styles
- Support for more themes
- Dropped roam support (check [mathieudutour/gatsby-digital-garden](https://github.com/mathieudutour/gatsby-digital-garden) if you need it)
- Reworked search UI
- Change graph diagram (redo with `@antv/g6`)
- Small table of contents at frame header (like GitHub has now)
- Sidbar with pages as folder structure

## Install

[![NPM](https://nodei.co/npm/gatsby-philipps-foam-theme.png)](https://nodei.co/npm/gatsby-philipps-foam-theme/)

```sh
npm install gatsby-philipps-foam-theme
```

## Setup 

Take a look into the [_layouts folder in the example directory](https://github.com/phartenfeller/gatsby-philipps-foam-theme/tree/master/example/_layouts)


### Manually add to your site

[Example Repository](https://github.com/phartenfeller/gatsby-philipps-foam-theme/tree/master/example)

1. Install the theme

   ```shell
   npm install gatsby-philipps-foam-theme autoprefixer gatsby gatsby-plugin-postcss postcss react react-dom
   ```

2. Add the configuration to your `gatsby-config.js` file

  [Config options explained](https://github.com/phartenfeller/gatsby-philipps-foam-theme/wiki)

   ```js
   // gatsby-config.js
   module.exports = {
     plugins: [
       {
         resolve: `gatsby-philipps-foam-theme`,
         options: {
           // basePath defaults to `/`
           basePath: `/garden`,
           rootNote: `/garden/About-these-notes`,
           contentPath: `/content/garden`,
         },
       },
     ],
   };
   ```
   
   You can ignore certain folders by adding an "ignore" array to the options:
   
   ```js
   plugins: [
    {
      resolve: `gatsby-philipps-foam-theme`,
      options: {
        rootNote: "/readme",
        contentPath: "/",
        ignore: [
          "**/_layouts/**",
          "**/private/**/*",
        ],
      },
    },
   ],
   ```

3. Add notes to your site by creating `md` or `mdx` files inside `/content/garden`.

4. Run your site using `gatsby develop` and navigate to your notes. If you used the above configuration, your URL will be `http://localhost:8000/{basePath}`

## Development

This is a yarn workspace. Just run `yarn` in the root to install.

To develop run `yarn start`.

### How to inject custom MDX Components?

1. Create a custom react component.

2. [Shadow](https://www.gatsbyjs.org/docs/themes/shadowing/) the component with the custom component created in step 1.

3. All the MDX components that are used within `gatsby-theme-garden` can be shadowed by placing the custom components under the following path `./src/gatsby-theme-garden/components/mdx-components/index.js`

### Example: Injecting a custom `CodeBlock` component to support Syntax Highlighting

1. Create a custom `CodeBlock` component as mentioned in the [MDX Guides](https://mdxjs.com/guides/syntax-highlighting#build-a-codeblock-component)

2. Create a file named `./src/gatsby-theme-garden/components/mdx-components/index.js` with the following content.

   ```js
   // the components provided by the theme
   export { AnchorTag as a } from "gatsby-theme-garden/src/components/mdx-components/anchor-tag";

   // your own component to inject into mdx
   export code from "./your-component"; // any code block will use this component
   ```
