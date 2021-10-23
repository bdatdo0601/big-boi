const { v4: uuid } = require("uuid");
const moment = require("moment");
const { has, get, every, isArray } = require("lodash");


// IFTTT Documentation https://maker.ifttt.com/use/q6bRYUkNBBJZP4VFhbYj6
const constructInitialEventFromApiGateway = (record, bodyData, handlerEvent) => {
    // Construct initial events through api gateway
    const event = {
      id: uuid(),
      sourceID: get(handlerEvent, "headers.X-Amzn-Trace-Id"),
      source: `${get(handlerEvent, "headers.Host")}${get(handlerEvent, "path")}`,
      eventType: get(bodyData, "eventType", null),
      content: {},
      metadata: {
        timestamp: moment(get(bodyData, "timestamp"), "Mon DD, YYYY [at] hh:mma").valueOf(),
        sourceURI: get(handlerEvent, "headers.X-Amzn-Trace-Id"),
        sourceMessage: record,
      }
    }
    
    return event;
 } 

exports.apiGatewayEventSourceProcessor = {
    validate: (handlerEvent) => {
        const requiredKeys = ["path", "httpMethod", "headers", "body"];
        // is this good to validate host?
        const isAPIGatewayRequest = every(requiredKeys, item => has(handlerEvent, item));
        if (!isAPIGatewayRequest) {
            console.warn("Not a valid API GATEWAY requests", handlerEvent);
        }
        return isAPIGatewayRequest;
        
    },
    retrieveInitialEvents: (handlerEvent) => {
        const rawData = get(handlerEvent, "body", "{}");
        const bodyData = JSON.parse(rawData);
        let records = get(bodyData, "events", []);
        records = isArray(records) ? records : [records]; 
        return records.map(item => constructInitialEventFromApiGateway(item, bodyData, handlerEvent))
    },
    getResponses: (responseData) => {
        return {
            statusCode: 200,
            body: JSON.stringify(responseData),
            isBase64Encoded: false
        }
    }
}