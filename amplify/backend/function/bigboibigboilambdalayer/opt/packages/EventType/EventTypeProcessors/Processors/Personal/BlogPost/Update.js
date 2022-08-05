const { get, includes, lowerCase } = require("lodash");
const assign = require('@recursive/assign');
const slugify = require('slugify');
const { PersonalPublishInfo } = require("../../../helpers/constants");


module.exports = {
    populateMetadata: async evt => assign(evt, { metadata: { visibility: "public", blogChange: true }, content: get(evt, "metadata.sourceMessage.eventData") }),
    populatePublishInfo: async evt => {
        const contentStatus = get(evt, "content.status");
        const target =  includes(["PUBLISHED"], contentStatus) && `\"${get(evt, "content.title")}\"`;
        const targetLink = includes(["PUBLISHED"], contentStatus) && `https://www.datbdo.com/blogs/${slugify(get(evt, "content.title"))}`;
        const publishInfo = {
            icon: {
                type: "Icon",
                value: "info"
            },
            ...PersonalPublishInfo,
            action: lowerCase(contentStatus),
            target,
            targetLink,
            message: `${PersonalPublishInfo.subject} just ${lowerCase(contentStatus)} a blog post ${target ? `: ${target}` : ""}`
        }
        return assign(evt, { publishInfo })
    },
    validateEvent: async evt => {
        return assign(evt, { metadata: { isValid: true } })
    }
}