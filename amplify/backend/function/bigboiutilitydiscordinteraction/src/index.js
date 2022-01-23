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

const isVerified = (evt) => {
    try {
        const signature = get(evt, "headers.x-signature-ed25519", "");
        const timestamp = get(evt, "headers.x-signature-timestamp", "");
        const rawBody = get(evt, "body"); // rawBody is expected to be a string, not raw bytes
        return nacl.sign.detached.verify(
            Buffer.from(timestamp + rawBody),
            Buffer.from(signature, 'hex'),
            Buffer.from(PUBLIC_KEY, 'hex')
        );
    } catch (err) {
        console.warn("verification failed: ", err);
        return false;
    }
} 

exports.handler = async (event) => {
    console.log("Receive Event: ", event);

    if (!isVerified(event)) {
        console.error("Event Not Verified");
        return {
            statusCode: 401,
            body: "Invalid request signature",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }, 
        }
    }

    const requestData = JSON.parse(get(event, "body", "{}"));
    console.log("request data: ", requestData)
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
