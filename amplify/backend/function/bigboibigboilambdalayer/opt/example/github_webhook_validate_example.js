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