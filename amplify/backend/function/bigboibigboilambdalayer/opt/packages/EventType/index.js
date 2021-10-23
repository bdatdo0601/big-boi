const { get } = require("lodash");

const { EventTypeProcessors } = require("./EventTypeProcessors");

exports.formatEventByEventType = async (evt, eventType) => {
    const eventTypeProcessor = get(EventTypeProcessors, eventType, EventTypeProcessors.Unknown);
    let event = await eventTypeProcessor.populateMetadata(evt);
    event = await eventTypeProcessor.populatePublishInfo(evt);
    event = await eventTypeProcessor.validateEvent(evt);
    return event;
}