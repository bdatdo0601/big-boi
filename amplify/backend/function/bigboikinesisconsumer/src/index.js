const get = require("lodash.get");
const { v4: uuid } = require("uuid");
const MessageSchema = require("/opt/schema/message.json");

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
     eventType: get(data, "eventType", "Unknown"),
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
  console.log(JSON.stringify(event, null, 2));
  let res = '';
  if ('Records' in event) {
    const events = await Promise.all(get(event, "Records").map(async record => {
      // Identify Event Source to populate metadata
      const event = constructInitialEventFromKinesis(record);
      // Populate publish info

      return event;
    }));
    // Validate events

    // Propagate to SNS topic
    res = events;
  } else {
    res += 'Kinesis records not present in event';
  }

  return Promise.resolve(res);
};
