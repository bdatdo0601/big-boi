const { lowerCase } = require("lodash");
const assign = require('@recursive/assign');
const { PersonalPublishInfo } = require("../../../helpers/constants");

module.exports = {
    populateMetadata: async evt => assign(evt, { metadata: { visibility: "public" } }),
    populatePublishInfo: async evt => {
        const contentStatus = "Update";
        const target =  "Resume";
        const targetLink = "https://www.dat.do/background";
        const publishInfo = {
            icon: {
                type: "Icon",
                value: "info"
            },
            ...PersonalPublishInfo,
            action: lowerCase(contentStatus),
            target,
            targetLink,
            message: `${PersonalPublishInfo.subject} just ${lowerCase(contentStatus)} ${target}`
        }
        return assign(evt, { publishInfo })
    },
    validateEvent: async evt => assign(evt, { metadata: { isValid: true } })
};
