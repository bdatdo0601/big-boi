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

exports.signedGraphQLMutationRequest = signedGraphQLMutationRequest;