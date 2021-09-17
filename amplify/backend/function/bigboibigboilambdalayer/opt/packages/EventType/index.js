const { get, includes, lowerCase } = require("lodash");
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
    return get(graphqlData, accessorString, {});
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
                populateMetadata: async evt => {},
                populatePublishInfo: async evt => {},
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

                    const additionalData = await queryGraphQLData(getBlogPost, { input: { id: get(evt, "content.id") } }, "data.data.getPost");
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
                    const targetLink = includes(["PUBLISHED"], contentStatus) && `https://www.dat.do/blogs/post/${get(evnt, "content.id")}`;
                    const publishInfo = {
                        icon: {
                            type: "Icon",
                            value: "info"
                        },
                        ...PersonalPublishInfo,
                        action: lowerCase(contentStatus),
                        target,
                        targetLink,
                        message: `Dat just ${lowerCase(contentStatus)} a blog post ${target && `: ${target}`}`
                    }
                    return assign(evt, { publishInfo })
                },
            }
        }
    },
    Unknown: {
        eventType: "Unknown",
        populateMetadata: async evt => evt,
        populatePublishInfo: async evt => evt,
    }
};

exports.formatEventByEventType = async (evt, eventType) => {
    const eventTypeProcessor = get(EventType, eventType, EventType.Unknown);
    console.log(evt, eventType);
    let event = await eventTypeProcessor.populateMetadata(evt);
    event = await eventTypeProcessor.populatePublishInfo(evt);
    return event;
}