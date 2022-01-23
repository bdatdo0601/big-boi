/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { get } = require("lodash");
const nacl = require('tweetnacl');

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = process.env.DISCORD_APPLICATION_PUBLIC_KEY;

exports.handler = async (event) => {
    console.log("Receive Event: ", event);

    const signature = get(event, "headers.x-signature-ed25519", "");
    const timestamp = get(event, "headers.x-signature-timestamp", "");
    const rawBody = get(event, "body"); // rawBody is expected to be a string, not raw bytes
    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + rawBody),
        Buffer.from(signature, 'hex'),
        Buffer.from(PUBLIC_KEY, 'hex')
    );

    if (!isVerified) {
        return {
            statusCode: 401,
            body: "Invalid request signature"
        }
    }

    const requestData = JSON.parse(rawBody || "{}");
    const result = {
        type: get(requestData, "type")
    }
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify(result),
    };
    return response;
};
