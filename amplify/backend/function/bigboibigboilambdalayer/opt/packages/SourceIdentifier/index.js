const { get } = require("lodash");

exports.identifySource = async event => {
    // TODO: determine event from content and metadata logic if eventType is not available
    return get(event, "eventType", "Unknown");
}