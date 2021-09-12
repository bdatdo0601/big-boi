const MessageSchema = require("/opt/schema/message.json");

exports.handler = event => {
  // insert code to be executed by your lambda trigger
  console.log(JSON.stringify(event, null, 2));
  let res = '';
  if ('Records' in event) {
    event.Records.forEach(record => {
      // Extrapolate data
      const { eventID, eventName, kinesis } = record;
      const { data } = kinesis;
      const eventData = JSON.parse(Buffer.from(data, "base64").toString());

      console.log(eventID);
      console.log(eventName);
      console.log('Kinesis Record: %j', kinesis);
      console.log('Data Record: %j', eventData);
    });
    res += 'Successfully processed DynamoDB record';
  } else {
    res += 'Kinesis records not present in event';
  }

  return Promise.resolve(res);
};
