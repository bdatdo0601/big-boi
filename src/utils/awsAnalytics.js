import Analytics from "@aws-amplify/analytics";

export const recordEvent = (name, attributes, ...args) => {
  Analytics.record({
    name,
    attributes,
    ...args,
  });
};

export default {
  recordEvent,
};
