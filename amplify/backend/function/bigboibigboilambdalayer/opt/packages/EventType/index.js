const { get, includes, lowerCase, isEmpty } = require("lodash");
const assign = require('@recursive/assign');
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const queryGraphQLData = async (query, variables, accessorString) => {
    const graphqlData = await axios({
        url: process.env.API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT,
        method: 'post',
        headers: {
          'x-api-key': process.env.API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
        },
        data: {
          query: print(query),
          variables,
        }
      });
    return get(graphqlData, accessorString, graphqlData);
}

const PersonalPublishInfo = {
    subject: "Dat",
    subjectLink: "https://www.dat.do/",
}

const EventType = {
    Personal: {
        BlogPost: {
            Update: {
                eventType: "Personal.BlogPost.Update",
                populateMetadata: async evt => evt,
                populatePublishInfo: async evt => {
                    const contentStatus = get(evt, "content.status");
                    const target =  includes(["PUBLISHED"], contentStatus) && `\"${get(evt, "content.title")}\"`;
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
                validateEvent: async evt => assign(evt, { metadata: { isValid: true } })
            },
            StatusUpdate: {
                eventType: "Personal.BlogPost.StatusUpdate",
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
            }
        },
        Resume: {
            Update: {
                eventType: "Personal.Resume.Update",
                populateMetadata: async evt => evt,
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
            },
        }
    },
    Unknown: {
        eventType: "Unknown",
        populateMetadata: async evt => evt,
        populatePublishInfo: async evt => evt,
        validateEvent: async evt => assign(evt, { metadata: { isValid: false } })
    }
};

exports.formatEventByEventType = async (evt, eventType) => {
    const eventTypeProcessor = get(EventType, eventType, EventType.Unknown);
    let event = await eventTypeProcessor.populateMetadata(evt);
    event = await eventTypeProcessor.populatePublishInfo(evt);
    event = await eventTypeProcessor.validateEvent(evt);
    return event;
}