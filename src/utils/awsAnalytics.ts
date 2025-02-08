import { RecordInput } from '@aws-amplify/analytics';
import { record as recordKinesisEvent } from '@aws-amplify/analytics/kinesis';
import { last, get } from 'lodash';
import awsexport from '@/amplifyconfiguration.json';

const env = last(get(awsexport, 'aws_content_delivery_bucket', 'test-dev').split('-'));

export const recordEvent = (name: string, attributes: Record<string, string>) => {
  const event: RecordInput = {
    name,
    attributes: { ...attributes, eventType: name },
  };
  try {
    recordKinesisEvent({
      partitionKey: name,
      data: { ...event.attributes },
      streamName: `bigboidefaultkinesis-${env}`,
    });
  } catch (err) {
    console.error(err);
  }
};
export default {
  recordEvent,
};
