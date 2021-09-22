/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { get, isEmpty, toInteger } = require("lodash");
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const moment = require("moment");
const { print } = graphql;

const mutateGraphQLData = async (query, variables) => {
    const response = await axios({
        url: process.env.API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT,
        method: 'post',
        headers: {
          'x-api-key': process.env.API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
        },
        data: {
          query: print(query),
          variables,
        }
      });
    return true;
}

exports.handler = async (event) => {
    if ('Records' in event) {
        const messages = await Promise.all(get(event, "Records", []).map(async record => {
            // TODO collect sns data
            const message = JSON.parse(get(record, "Sns.Message", "{}"));
            if (!isEmpty(message)) {
                // Save to AppSync
                const createEventMessage = gql`
                        mutation CreateEventMessage(
                            $input: CreateEventMessageInput!
                            $condition: ModelEventMessageConditionInput
                        ) {
                            createEventMessage(input: $input, condition: $condition) {
                                id
                            }
                        }
                    `
                const variables = {
                    input: {
                        ...message,
                        type: "Event",
                        content: JSON.stringify(get(message, "content", {})),
                        metadata: JSON.stringify(get(message, "metadata", {})),
                        publishInfo: JSON.stringify(get(message, "publishInfo", {})),
                        timestamp: moment(get(message, "metadata.timestamp", moment().valueOf())).toISOString()
                    }
                }
                await mutateGraphQLData(createEventMessage, variables);
            }
        }));
        return messages;
    }
    return { error: "Invalid messages" };
};
