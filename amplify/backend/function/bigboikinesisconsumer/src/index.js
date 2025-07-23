/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const { get, omit } = require('lodash');

const { identifySource } = require('/opt/packages/SourceIdentifier');
const { formatEventByEventType } = require('/opt/packages/EventType');
const { publishMessage } = require('/opt/packages/MessagePublisher');
const { getEventSource, EventSourcesProcessors } = require('./eventSourceProcessors');
const { EventBridge } = require('aws-sdk');

const eventBridge = new EventBridge();

exports.handler = async handlerEvent => {
  const eventSource = getEventSource(handlerEvent);

  if (!eventSource) {
    console.error('Invalid Event Source', handlerEvent);
    return { statusCode: 400, body: '{}', isBase64Encoded: false };
  }

  const events = await Promise.all(
    EventSourcesProcessors[eventSource].retrieveInitialEvents(handlerEvent).map(async record => {
      // Identify Event Type
      const eventType = await identifySource(record);
      // Populate metadata and publish info and validate events
      const resultEvent = await formatEventByEventType(record, eventType);
      return resultEvent;
    })
  );
  // Only sent out valid event
  // TODO: properly handle invalid event
  const validEvents = events
    .filter(evt => get(evt, 'metadata.isValid', false))
    .map(evt => omit(evt, ['metadata.sourceMessage.headers']));
  const invalidEvents = events
    .filter(evt => !get(evt, 'metadata.isValid', false))
    .map(evt => omit(evt, ['metadata.sourceMessage.headers']));
  for (const evt of validEvents) {
    try {
      // Propagate to SNS topic
      await publishMessage(evt);
      // Propagate to event bridge
      await eventBridge
        .putEvents({
          Entries: [
            {
              Source: 'custom.lambda.bigboikinesisconsumer',
              DetailType: 'LegacyEventStream',
              Detail: JSON.stringify(evt),
              EventBusName: 'BigBus',
            },
          ],
        })
        .promise();
    } catch (err) {
      console.error('Error publishing message', err, validEvents);
    }
  }

  for (const evt of invalidEvents) {
    console.warn('Invalid Event', evt);
  }

  const responseData = { validEvents };

  const response = await EventSourcesProcessors[eventSource].getResponses(responseData);
  console.info(response);
  return response;
};
