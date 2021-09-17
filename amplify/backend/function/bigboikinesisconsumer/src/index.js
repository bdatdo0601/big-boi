const { get } = require("lodash");
const { v4: uuid } = require("uuid");

const MessageSchema = require("/opt/schema/message.json");
const { identifySource } = require("/opt/packages/SourceIdentifier");
const { formatEventByEventType } = require("/opt/packages/EventType");

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
      const eventType = identifySource(event);
      // Populate metadata and publish info
      const resultEvent = formatEventByEventType(event, eventType);

      return resultEvent;
    }));
    // TODO: Validate events and separate to different topic
    console.log(events);
    // Propagate to SNS topic
    res = events;
  } else {
    res = { error: 'Kinesis records not present in event' };
  }

  return Promise.resolve(res);
};
