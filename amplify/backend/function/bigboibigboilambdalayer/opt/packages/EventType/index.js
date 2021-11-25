const { get } = require("lodash");

const { EventTypeProcessors } = require("./EventTypeProcessors");

exports.formatEventByEventType = async (evt, eventType) => {
    const eventTypeProcessor = get(EventTypeProcessors, eventType, EventTypeProcessors.Unknown);
    try {
        console.log(`Processed with event type ${eventType}`)
        let event = await eventTypeProcessor.populateMetadata(evt);
        event = await eventTypeProcessor.populatePublishInfo(event);
        if (eventTypeProcessor.processEvent) {
            console.log("Event needs to be processed");
            await eventTypeProcessor.processEvent(event);
        }
        event = await eventTypeProcessor.validateEvent(event);
        return event;
    } catch (errors) {
        console.error(errors);
        return evt;
    }
}