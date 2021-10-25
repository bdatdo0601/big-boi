const { v4: uuid } = require("uuid");
const { has, get, every } = require("lodash");

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
      content: {},
      metadata: {
        timestamp: approximateArrivalTimestamp,
        sourceURI: eventSourceARN,
        sourceMessage: { ...record, eventData },
      }
    }
    
    return event;
 } 

exports.kinesisEventSourceProcessor = {
    validate: (handlerEvent) => {
        if (!has(handlerEvent, "Records")) {
            console.warn("Not a valid Kinesis Events: Does not have `Records` Field", handlerEvent);
            return false;
        }
        const isKinesis = every(get(handlerEvent, "Records", []), item => has(item, "kinesis"));
        if (!isKinesis) {
            console.warn("Not a valid Kinesis Events: Events does not have `Kinesis` data", handlerEvent);
        }
        return isKinesis;
    },
    retrieveInitialEvents: (handlerEvent) => {
        return get(handlerEvent, "Records", []).map(record => constructInitialEventFromKinesis(record));
    },
    getResponses: responseData => responseData,
}