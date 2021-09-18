const aws = require("aws-sdk");

const DefaultMessageStructure = {};

exports.publishMessage = async (message, messageConfig = DefaultMessageStructure, topicEndpointArn = process.env.ANALYTICS_BIGBOINOTIFICATION_SNSTOPICARN) => {
    const sns = new aws.SNS();

    await sns.publish({
        Message: JSON.stringify(message),
        TopicArn: topicEndpointArn,
        ...messageConfig
    }).promise();
}