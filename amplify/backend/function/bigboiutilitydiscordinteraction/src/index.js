/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["VERIFY_TOKEN"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { get } = require("lodash");
const aws = require('aws-sdk');

const getRequestData = (evt) => {
    const httpMethod = get(evt, "httpMethod");
    
    switch (httpMethod) {
        case "GET":
            return get(evt, "queryStringParameters", {});
        case "POST":
            return JSON.parse(get(evt, "body", "{}"));
        default:
            return {}
    }
};

const validateVerificationRequest = async (requestData) => {
    // Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
    const tokenName = "VERIFY_TOKEN"

    const mode = requestData["hub.mode"];
    const token = requestData["hub.verify_token"];
    const challenge = requestData["hub.challenge"];

    if (!mode || !token || !challenge) {
        return null;
    }

    const { Parameters } = await (new aws.SSM())
        .getParameters({
            Names: [tokenName].map(secretName => process.env[secretName]),
            WithDecryption: true,
        })
        .promise();
    const secret = get(Parameters, "0.Value");
    if (!secret) {
        return null;
    }

    if (mode === "subscribe" && token === secret) {
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }, 
            body: challenge,
        }
    }
    return {
        statusCode: 403,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    };
}

exports.handler = async (event) => {
    console.log("Receive Event: ", event);

    const requestData = getRequestData(event);
    console.log("request data: ", requestData)

    const validationResponse = await validateVerificationRequest(requestData);

    if (validationResponse) {
        return validationResponse;
    }

    const response = {
        statusCode: 501,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: null,
    };
    return response;
};
