const { get } = require("lodash");
const urlMetadata = require('url-metadata');

const ALLOW_CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
}

exports.handler = async (event) => {
    console.log("Receive Event: ", event);
    const rawBody = get(event, "body");
    const requestData = JSON.parse(rawBody || "{}");
    try {
        const metadata = await urlMetadata(get(requestData, "url"));
    
        const response = {
            statusCode: 200,
            headers: {
                ...ALLOW_CORS_HEADERS
            }, 
            body: JSON.stringify({ ...metadata, isPrivate: false }),
        };
        return response;
    } catch (err) {
        return {
            statusCode: 200,
            headers: {
                ...ALLOW_CORS_HEADERS
            }, 
            body: JSON.stringify({ isPrivate: true })
        }
    }
};
