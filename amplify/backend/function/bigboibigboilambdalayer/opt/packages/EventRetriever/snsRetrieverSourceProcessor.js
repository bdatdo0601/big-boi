const { has, get, every, isEmpty } = require("lodash");

exports.snsRetrieverSourceProcessor = {
    validate: (handlerEvent) => {
        if (!has(handlerEvent, "Records")) {
            console.warn("Not a valid SNS Events: Does not have `Records` Field", handlerEvent);
            return false;
        }
        const isSNS = every(get(handlerEvent, "Records", []), item => has(item, "Sns.Message"));
        if (!isSNS) {
            console.warn("Not a valid SNS Events: does not have `Sns.Message` data", handlerEvent);
        }
        return isSNS;
    },
    retrieveEvents: (handlerEvent) => {
        return get(handlerEvent, "Records", [])
            .map(record => JSON.parse(get(record, "Sns.Message", "{}")))
            .filter(message => !isEmpty(message));
    }
}