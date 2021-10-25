const assign = require('@recursive/assign');
const { singular } = require("pluralize");
const { isEmpty, get, pick, uniq, capitalize, has } = require('lodash');
const { PersonalPublishInfo } = require('../helpers/constants');

const SPECIAL_GITHUB_ACTION_TO_URL = {
    push: "compare",
    fork: "forkee.html_url" 
}

module.exports = {
    populateMetadata: async evt => {
        const sourceMessage = get(evt, "metadata.sourceMessage");
        const githubActionType = get(evt, "metadata.sourceMessage.headers.X-GitHub-Event");
        if (!githubActionType) {
            return evt;
        }
        const contentData = pick(sourceMessage, uniq([singular(githubActionType), "sender", "repository", "action"]));
        return assign(evt, { metadata: { visibility: "public" }, content: { githubActionType, ...contentData  } })
    },
    populatePublishInfo: async evt => {
        if (isEmpty(get(evt, "content"))) {
            return evt;
        }
        
        const isDatTheSender = PersonalPublishInfo.githubHandle === get(evt, "content.sender.login");
        const githubActionType = get(evt, "content.githubActionType");
        const formattedActionType = singular(githubActionType);
        const githubAction = get(evt, "content.action", `${formattedActionType}ed`);
        const subject = isDatTheSender ? PersonalPublishInfo.subject : get(evt, "content.sender.login");
        const target = `${has(evt, "content.action") ? capitalize(formattedActionType.replace(/\_/g, " ")) : ""}${isDatTheSender ? " on GitHub" : " on Dat's GitHub"}`;
        const publishInfo = {
            icon: {
                type: "Icon",
                value: "GitHub",
                link: get(evt, "content.repository.html_url")
            },
            action: githubAction,
            subject,
            subjectLink: get(evt, "content.sender.html_url"),
            target,
            targetLink: get(evt, `content.${formattedActionType}.html_url`, get(evt, `metadata.sourceMessage.${SPECIAL_GITHUB_ACTION_TO_URL[githubActionType]}`, get(evt, "content.repository.html_url"))),
            message: `${subject} just ${githubAction}${has(evt, "content.action") ? " a/an " : " "}${target}`
        }
        return assign(evt, { publishInfo });
    },
    validateEvent: async evt => {
        const isValid = !isEmpty(get(evt, "content"));
        return assign(evt, { metadata: { isValid } })
    }
}