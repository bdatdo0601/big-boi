const { get, includes, lowerCase } = require("lodash");
const assign = require('@recursive/assign');
const { PersonalPublishInfo, redeployBlogSite } = require("../../../helpers/constants");

const NOTION_ICON_DATA = "data:image/png;base64,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"

module.exports = {
    populateMetadata: async evt => assign(evt, { metadata: { visibility: "public" }, content: get(evt, "metadata.sourceMessage.eventData") }),
    populatePublishInfo: async evt => {
        const contentStatus = get(evt, "content.status");
        const target =  includes(["PUBLISHED"], contentStatus) && `\"${get(evt, "content.title")}\"`;
        const targetLink = includes(["PUBLISHED"], contentStatus) && get(evt, "content.data.url");
        const publishInfo = {
            icon: {
                type: "image_data",
                value: NOTION_ICON_DATA
            },
            ...PersonalPublishInfo,
            action: lowerCase(contentStatus),
            target,
            targetLink,
            message: `${PersonalPublishInfo.subject} just ${lowerCase(contentStatus)} a Notion post${target ? `: ${target}` : ""}`
        }
        return assign(evt, { publishInfo })
    },
    validateEvent: async evt => {
        await redeployBlogSite();
        assign(evt, { metadata: { isValid: true } })
    }
}