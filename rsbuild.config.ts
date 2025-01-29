import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { InjectManifestPlugin } from "inject-manifest-plugin";

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [new InjectManifestPlugin({ file: "./service-worker.ts" })],
    },
  },
  html: {
    template: "./index.html",
  },
  output: {
    distPath: {
      root: "build",
    },
  },
  source: {
    define: {
      "import.meta.env.PUBLIC_URL": JSON.stringify(
        process.env.PUBLIC_URL || "https://datbdo.com"
      ),
      "import.meta.env.SITE_VERSION": JSON.stringify(process.env.SITE_VERSION),
      "import.meta.env.SITE_WEBSITE_TITLE": JSON.stringify(
        process.env.SITE_WEBSITE_TITLE || "Dat Do"
      ),
    },
    entry: {
      index: "./src/index.tsx",
    },
  },
});
