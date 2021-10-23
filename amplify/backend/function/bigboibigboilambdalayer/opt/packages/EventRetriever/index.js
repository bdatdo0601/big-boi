
const { snsRetrieverSourceProcessor } = require("./snsRetrieverSourceProcessor");

const EventRetrieverSource = {
    SNS: "SNS"
}

exports.getEventRetrieverSource = handlerEvent => {
    if (snsRetrieverSourceProcessor.validate(handlerEvent)) {
        return EventRetrieverSource.SNS;
    }
    return false;
}

exports.EventRetrieverProcessors = {
    [EventRetrieverSource.SNS]: snsRetrieverSourceProcessor,
}