/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { get, isEmpty } = require("lodash");
const gql = require('graphql-tag');
const moment = require("moment");
const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const graphql = require('graphql');
const { print } = graphql;


const DefaultSignedMutationConfig = {
    endpoint: process.env.API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.REGION,
    method: "POST",
    path: "/graphql",
    headers: {
        host: new urlParse(process.env.API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT).hostname.toString(),
        "Content-Type": "application/json",
    },
    apiKey: process.env.API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT,
}

const signedGraphQLMutationRequest = async (query, variables, isUsingAPIKey = false, config = DefaultSignedMutationConfig) => {
    const req = new AWS.HttpRequest(config.endpoint, config.region);

    req.method = config.method;
    req.path = config.path;
    req.headers = {
        ...req.headers,
        ...config.headers
    }
    req.body = JSON.stringify({
        query: print(query),
        variables
    });

    if (isUsingAPIKey) {
        req.headers["x-api-key"] = config.apiKey;
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: config.headers.host }, (result) => {
            let data = "";

            result.on("data", (chunk) => {
                data += chunk;
            });

            result.on("end", () => {
                resolve(JSON.parse(data.toString()));
            });

            result.on("error", (err) => {
                reject(err);
            })
        });

        httpRequest.write(req.body);
        httpRequest.end();
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
                await signedGraphQLMutationRequest(createEventMessage, variables);
            }
        }));
        return messages;
    }
    return { error: "Invalid messages" };
};
