/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const { get } = require("lodash");
const { v4: uuid } = require("uuid");

const { identifySource } = require("/opt/packages/SourceIdentifier");
const { formatEventByEventType } = require("/opt/packages/EventType");
const { publishMessage } = require("/opt/packages/MessagePublisher");

const constructInitialEventFromKinesis = (record) => {
   // Extrapolate data
   const { eventID, eventName, kinesis, eventSourceARN } = record;
   const { data, approximateArrivalTimestamp } = kinesis;
   const eventData = JSON.parse(Buffer.from(data, "base64").toString());

   // Construct initial events through kinesis
   const event = {
     id: uuid(),
     sourceID: eventID,
     source: eventName,
     eventType: get(eventData, "eventType", null),
     content: eventData,
     metadata: {
       timestamp: approximateArrivalTimestamp,
       sourceURI: eventSourceARN,
       sourceMessage: record,
     }
   }
   
   return event;
} 

exports.handler = async event => {
  // insert code to be executed by your lambda trigger
  let res = {};
  if ('Records' in event) {
    const events = await Promise.all(get(event, "Records").map(async record => {
      // Construct intial event source
      const event = constructInitialEventFromKinesis(record);
      // Identify Event Type
      const eventType = await identifySource(event);
      // Populate metadata and publish info and validate events
      const resultEvent = await formatEventByEventType(event, eventType);
      return resultEvent;
    }));
    // Only sent out valid event
    // TODO: properly handle invalid event
    const validEvents = events.filter(evt => get(evt, "metadata.isValid", false));
    for (const evt of validEvents) {
      // Propagate to SNS topic
      await publishMessage(evt);
    }
    res = events;
  } else {
    res = { error: 'Kinesis records not present in event' };
  }

  return Promise.resolve(res);
};
