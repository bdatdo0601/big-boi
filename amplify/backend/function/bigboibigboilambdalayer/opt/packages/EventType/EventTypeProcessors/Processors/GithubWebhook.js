const assign = require('@recursive/assign');
const GITHUB_SCHEMA = require("../../../../schema/github_webhooks.json");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { singular } = require("pluralize");
const { isEmpty, get, pick, uniq, capitalize } = require('lodash');
const { PersonalPublishInfo } = require('../helpers/constants');

const getGithubWebhookActionInfo = async githubEvent => {
    console.time("action info")
    const ajv = new Ajv({
        strict: true,
        strictTypes: true,
        strictTuples: true,
        allErrors: true,
    });
    addFormats(ajv);
    ajv.addKeyword("tsAdditionalProperties");
    
    ajv.compile(GITHUB_SCHEMA);
    console.timeLog("action info", "finish initialize ajv")
    const webhookAction = Object.keys(GITHUB_SCHEMA.definitions)
    .filter(key => !key.includes("$")) // only use event with action
    .find(key => {
        return ajv.validate(`#/definitions/${key}`, githubEvent);
    })
    console.timeLog("action info", "validate webhook")
    return webhookAction && webhookAction.replace(/(\_event)/g, "");
}

module.exports = {
    populateMetadata: async evt => {
        const sourceMessage = get(evt, "metadata.sourceMessage");
        const githubActionType = await getGithubWebhookActionInfo(sourceMessage);
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
        const githubAction = get(evt, "content.action");
        const subject = isDatTheSender ? PersonalPublishInfo.subject : "Someone else";
        const target = `${capitalize(githubActionType.replace(/\_/g, " "))}${isDatTheSender ? "" : " from Dat's GitHub"}`;
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
            targetLink: get(evt, `content.${singular(githubActionType)}.html_url`),
            message: `${subject} just ${githubAction} a/an ${target}`
        }
        return assign(evt, { publishInfo });
    },
    validateEvent: async evt => {
        const isValid = !isEmpty(get(evt, "content"));
        return assign(evt, { metadata: { isValid } })
    }
}