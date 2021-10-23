/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const { get } = require("lodash");

const { identifySource } = require("/opt/packages/SourceIdentifier");
const { formatEventByEventType } = require("/opt/packages/EventType");
const { publishMessage } = require("/opt/packages/MessagePublisher");
const { getEventSource, EventSourcesProcessors } = require("./eventSourceProcessors");

exports.handler = async handlerEvent => {
  const eventSource = getEventSource(handlerEvent);

  const events = await Promise.all(EventSourcesProcessors[eventSource].retrieveInitialEvents(handlerEvent).map(async record => {
    // Identify Event Type
    const eventType = await identifySource(record);
    // Populate metadata and publish info and validate events
    const resultEvent = await formatEventByEventType(record, eventType);
    return resultEvent;
  }));
  // Only sent out valid event
  // TODO: properly handle invalid event
  const validEvents = events.filter(evt => get(evt, "metadata.isValid", false));
  const invalidEvents = events.filter(evt => !get(evt, "metadata.isValid", true));
  for (const evt of validEvents) {
    // Propagate to SNS topic
    await publishMessage(evt);
  }

  const responseData = {
    validEvents,
    invalidEvents,
  }

  const response = await EventSourcesProcessors[eventSource].getResponses(responseData);

  return Promise.resolve(response);
};
