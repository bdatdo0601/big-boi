const { get, includes, lowerCase, isEmpty } = require("lodash");
const assign = require('@recursive/assign');
const gql = require('graphql-tag');
const { queryGraphQLData } = require("../../../../../utils/queryGraphQLData");
const { PersonalPublishInfo } = require("../../../helpers/constants");

module.exports = {
    populateMetadata: async evt => {
        const getBlogPost = gql`
            query GetPost($id: ID!) {
                getPost(id: $id) {
                    id
                    title
                    status
                    tags
                    updatedAt
                    createdAt
                }
            }
        `

        const additionalData = await queryGraphQLData(getBlogPost, { id: get(evt, "content.id") }, "data.data.getPost");
        return assign(evt, {
            metadata: {
                visibility: "public",
                additionalData
            }
        })
    },
    populatePublishInfo: async evt => {
        const contentStatus = get(evt, "content.status");
        const target =  includes(["PUBLISHED"], contentStatus) && `\"${get(evt, "metadata.additionalData.title")}\"`;
        const targetLink = includes(["PUBLISHED"], contentStatus) && `https://www.dat.do/blogs/post/${get(evt, "content.id")}`;
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
    validateEvent: async evt => assign(evt, { metadata: { isValid: !isEmpty(get(evt, "metadata.additionalData", {})) } })
};