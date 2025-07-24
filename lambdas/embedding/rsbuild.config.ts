import { pluginAwsLambda } from "rsbuild-plugin-aws-lambda";

export default {
  plugins: [pluginAwsLambda()],
  output: {
    minify: false,
  },
};
