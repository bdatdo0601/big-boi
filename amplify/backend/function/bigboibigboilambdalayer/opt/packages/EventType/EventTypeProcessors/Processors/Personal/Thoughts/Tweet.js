const { get, last } = require("lodash");
const assign = require('@recursive/assign');
const gql = require("graphql-tag");
const { v4: uuid } = require("uuid");

const { PersonalPublishInfo } = require("../../../helpers/constants");
const { signedGraphQLMutationRequest } = require("../../../../../utils/signedGraphQLMutationRequest");

const Owner = "5655c0b7-1480-4e60-bdb0-125b81faec5a";

module.exports = {
    populateMetadata: async evt => assign(evt, { metadata: { visibility: "public", blogChange: true }, content: { ...get(evt, "metadata.sourceMessage"), tweetID: last(get(evt, "metadata.sourceMessage.link").split("/")) } }),
    populatePublishInfo: async evt => {
        const target = "a thought";
        const targetLink = get(evt, "content.link");
        const publishInfo = {
            icon: {
                type: "icon",
                value: "Twitter",
                link: `https://twitter.com/${get(evt, "content.username")}`
            },
            ...PersonalPublishInfo,
            action: "tweet",
            target,
            targetLink,
            message: `${PersonalPublishInfo.subject} just tweet ${target}`
        }
        return assign(evt, { publishInfo })
    },
    processEvent: async evt => {
        const createPost = gql`
            mutation CreatePost(
                $input: CreatePostInput!
                $condition: ModelPostConditionInput
            ) {
                createPost(input: $input, condition: $condition) {
                id
                title
                data
                updatedAt
                createdAt
                }
            }
        `;
        const tweetLocalID = uuid();
        const data = get(evt, "content", {});
        const variables = {
            input: {
                id: tweetLocalID,
                title: `${tweetLocalID} Twitter Tweet`,
                data: JSON.stringify(data),
                tags: [],
                externalLink: get(evt, "content.link"),
                postType: "Twitter",
                owner: Owner,
                description: get(evt, "content.text"),
                status: "PUBLISHED",
            }
        }
        const response = await signedGraphQLMutationRequest(createPost, variables);
        console.log(response);
        return evt;
    },
    validateEvent: async evt => assign(evt, { metadata: { isValid: true } })
}