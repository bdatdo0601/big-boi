/* Amplify Params - DO NOT EDIT
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
	STORAGE_BIGBOICONTENT_BUCKETNAME
Amplify Params - DO NOT EDIT */

const { Client } = require("@notionhq/client");
const { get } = require("lodash");
const gql = require('graphql-tag');
const moment = require("moment");

const { getNotionBlogPosts, retrievePageMetadata } = require("./Notion");
const { queryGraphQLData, signedGraphQLMutationRequest } = require("./utils");

const RootBlockID = process.env.NOTION_BLOGPOST_BLOCKID;
const auth = process.env.NOTION_INTEGRATION_TOKEN;

const BlogPostSource = {
    NOTION: "notion"
};

const listBlogPost = gql`
    query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        status
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;

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

const updatePost = gql`
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      data
      updatedAt
      createdAt
    }
  }
`;


exports.handler = async () => {
    const client = new Client({ 
        auth
    })
    const notionRawBlogPosts = await getNotionBlogPosts(client, RootBlockID);

    const currentBlogPosts = await queryGraphQLData(listBlogPost, { limit: 10000 }, "data.data.listPosts.items")

    const notionBlogPosts = await Promise.all(notionRawBlogPosts.map(async blogPostOGData => {
        const rawBlogPostData = await retrievePageMetadata(client, get(blogPostOGData, "id"));
        console.log(JSON.stringify(rawBlogPostData, null, 4));
        return rawBlogPostData
    }));

    const newBlogPosts = [
        ...notionBlogPosts.filter(item => !currentBlogPosts.find(post => post.id === item.id))
    ];

    const updatingBlogPosts = [
        ...notionBlogPosts.filter(item => {
            const existingBlogPost = currentBlogPosts.find(post => post.id === item.id);
            if (!existingBlogPost) {
                return false;
            }
            return moment(item.attributes.updatedAt).valueOf() > moment(existingBlogPost.updatedAt).valueOf()
        })
    ];

    const createResult = await Promise.all(newBlogPosts.map(async item => {
        const data = {
            rawData: item,
            attributes: get(item, "attributes", {}),
            immutability: ["ARCHIVED"],
            url: get(item, "url"),
            type: BlogPostSource.NOTION,
            text: "",
        }
        const variables = {
            input: {
                id: get(item, "attributes.id"),
                title: get(item, "attributes.title"),
                data: JSON.stringify(data),
                tags: [],
                description: "This blog is written in Notion",
                status: get(item, "attributes.archived", true) ? "ARCHIVED" : "DRAFT",
                updatedAt: get(item, "attributes.updatedAt"),
            }
        }

        return await signedGraphQLMutationRequest(createPost, variables);
    }));

    const updatingResult = await Promise.all(updatingBlogPosts.map(async item => {
        const variables = {
            input: {
                id: get(item, "attributes.id"),
                title: get(item, "attributes.title"),
                tags: [],
                description: "This blog is written in Notion",
                ...(get(item, "attributes.archived", true) ? { status: "ARCHIVED" } : {}),
                updatedAt: get(item, "attributes.updatedAt"),
            }
        }
        
        return await signedGraphQLMutationRequest(updatePost, variables);
    }));

    return { errors: [], newBlogPosts, updatingBlogPosts };
};

