import { pluginAwsLambda } from "rsbuild-plugin-aws-lambda";

export default {
  plugins: [pluginAwsLambda()],
  output: {
    minify: false,
  },
  source: {
    exclude: [
      /test\//,
      /\.test\./,
      /\.spec\./,
      /test-runner\.sh/,
      /verify-tests\.js/,
    ],
  },
};
