const { get } = require("lodash");

const { EventTypeProcessors } = require("./EventTypeProcessors");

exports.formatEventByEventType = async (evt, eventType) => {
    const eventTypeProcessor = get(EventTypeProcessors, eventType, EventTypeProcessors.Unknown);
    try {
        console.log(`Processed with event type ${eventType}`)
        let event = await eventTypeProcessor.populateMetadata(evt);
        console.log("Populated Metadata");
        event = await eventTypeProcessor.populatePublishInfo(evt);
        console.log("Populated Publish Info");
        event = await eventTypeProcessor.validateEvent(evt);
        console.log("Validated Event");
        return event;
    } catch (errors) {
        console.error(errors);
        return evt;
    }
}