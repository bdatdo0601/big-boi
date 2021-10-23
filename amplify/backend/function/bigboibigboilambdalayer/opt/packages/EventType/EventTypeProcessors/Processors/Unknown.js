const assign = require('@recursive/assign');

module.exports = {
    populateMetadata: async evt => evt,
    populatePublishInfo: async evt => evt,
    validateEvent: async evt => assign(evt, { metadata: { isValid: false } })
}