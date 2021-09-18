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
    console.log(JSON.stringify(response.data, null, 4));
    return true;
}

exports.handler = async (event) => {
    console.log(JSON.stringify(event, null, 4));
    if ('Records' in event) {
        const messages = await Promise.all(get(event, "Records", []).map(async record => {
            // TODO collect sns data
            const message = JSON.parse(get(record, "Sns.Message", "{}"));
            if (!isEmpty(message)) {
                // Save to AppSync
                const createEventMessage = gql`
                        mutation CreateEventMessageData(
                            $input: CreateEventMessageDataInput!
                            $condition: ModelEventMessageDataConditionInput
                        ) {
                            createEventMessageData(input: $input, condition: $condition) {
                                id
                            }
                        }
                    `
                const variables = {
                    input: {
                        ...message,
                        content: JSON.stringify(get(message, "content", {})),
                        metadata: JSON.stringify(get(message, "metadata", {})),
                        publishInfo: JSON.stringify(get(message, "publishInfo", {})),
                        timestamp: toInteger(get(message, "metadata.timestamp", moment().valueOf()))
                    }
                }
                await mutateGraphQLData(createEventMessage, variables);
            }
        }));
        return messages;
    }
    return { error: "Invalid messages" };
};
