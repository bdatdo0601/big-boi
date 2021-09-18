const aws = require("aws-sdk");

const DefaultMessageStructure = {
    MessageStructure: 'json',
};

exports.publishMessage = async (message, messageConfig = DefaultMessageStructure, topicEndpointArn = process.env.ANALYTICS_BIGBOINOTIFICATION_SNSTOPICARN) => {
    const sns = new aws.SNS();

    await sns.publish({
        Message: message,
        TopicArn: topicEndpointArn,
        ...messageConfig
    })
}