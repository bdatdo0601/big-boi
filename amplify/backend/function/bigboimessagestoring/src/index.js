/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { get } = require("lodash");
const gql = require('graphql-tag');
const moment = require("moment");
const { signedGraphQLMutationRequest } = require("/opt/packages/utils/signedGraphQLMutationRequest");
const { getEventRetrieverSource, EventRetrieverProcessors } = require("/opt/packages/EventRetriever");
const { redeployBlogSite } = require("/opt/packages/utils/redeployBlogSite");

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

const createPrivateEventMessage = gql`
    mutation CreatePrivateEventMessage(
        $input: CreatePrivateEventMessageInput!
        $condition: ModelPrivateEventMessageConditionInput
    ) {
        createPrivateEventMessage(input: $input, condition: $condition) {
            id
        }
    }
`

const generateVariableInput = message => ({
    input: {
        ...message,
        type: "Event",
        content: JSON.stringify(get(message, "content", {})),
        metadata: JSON.stringify(get(message, "metadata", {})),
        publishInfo: JSON.stringify(get(message, "publishInfo", {})),
        timestamp: moment(get(message, "metadata.timestamp", moment().valueOf())).toISOString()
    }
})

// message storing handler
exports.handler = async (handlerEvent) => {
    const eventRetrieverSource = getEventRetrieverSource(handlerEvent);

    if (!eventRetrieverSource) {
      console.error("Invalid Event Retriever Source", handlerEvent);
      return { statusCode: 400, body: "{}", isBase64Encoded: false };
    }

    const messages = EventRetrieverProcessors[eventRetrieverSource].retrieveEvents(handlerEvent);
    
    if (messages.some(message => get(message, "metadata.blogChange"))) {
       await redeployBlogSite();
    }

    await Promise.all(messages.map(async message => {
        const variables = generateVariableInput(message);
        const visibility = get(message, "metadata.visibility", "private");
        let graphQLQuery = null;
        switch (visibility) {
            case "public":
                graphQLQuery = createEventMessage;
                break;
            case "private":
                graphQLQuery = createPrivateEventMessage;
                break;
            default:
                graphQLQuery = createPrivateEventMessage;
                break; 
        }
        await signedGraphQLMutationRequest(graphQLQuery, variables);
    }));

    return { messages, statusCode: 200 };
};
