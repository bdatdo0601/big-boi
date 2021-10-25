const aws = require('aws-sdk');

// API_ENDPOINT
const axios = require("axios");
const { get } = require("lodash");
const moment = require("moment");

const API_ENDPOINT = process.env.API_ENDPOINT;

const ACCEPTED_SOURCES = ["GithubWebhook"];

exports.handler = async (event) => {
    const source = get(event, "queryStringParameters.source", "");

    if (!source || !ACCEPTED_SOURCES.includes(source)) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: "source query string parameter does not exist or is not accepted" })
        }
    }

    await axios.post(`${API_ENDPOINT}/event`, { 
        eventType: source,
        timestamp: moment().valueOf(),
        events: [JSON.parse(get(event, "body", "{}"))]
    }, { 
        headers: {
            "x-api-key": process.env.API_KEY,
            ...get(event, "headers", {})
        } 
    });

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: { message: "Success" },
    };
    return response;
};
