const { kinesisEventSourceProcessor } = require("./kinesisEventSourceProcessor");
const { apiGatewayEventSourceProcessor } = require("./apiGatewayEventSourceProcessor");

const EventSource = {
    KINESIS: "KINESIS",
    API_GATEWAY: "API_GATEWAY"
}

exports.getEventSource = handlerEvent => {
    if (kinesisEventSourceProcessor.validate(handlerEvent)) {
        return EventSource.KINESIS;
    }
    if (apiGatewayEventSourceProcessor.validate(handlerEvent)) {
        return EventSource.API_GATEWAY;
    }
    return false;
}

exports.EventSourcesProcessors = {
    [EventSource.KINESIS]: kinesisEventSourceProcessor,
    [EventSource.API_GATEWAY]: apiGatewayEventSourceProcessor,
}