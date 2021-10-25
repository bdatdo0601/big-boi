/* Amplify Params - DO NOT EDIT
	ANALYTICS_BIGBOIANALYTICS_ID
	ANALYTICS_BIGBOIANALYTICS_REGION
	ANALYTICS_BIGBOIDEFAULTKINESIS_KINESISSTREAMARN
	API_BIGBOIAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIIDOUTPUT
	API_BIGBOIAPI_GRAPHQLAPIKEYOUTPUT
	API_BIGBOIEXTERNALAPI_APIID
	API_BIGBOIEXTERNALAPI_APINAME
	ENV
	REGION
	STORAGE_BIGBOICONTENT_BUCKETNAME
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
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
        data
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

const deletePost = gql`
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      data
      updatedAt
      createdAt
    }
  }
`;

const synchronizeNotionBlogPosts = async (currentBlogPosts) => {
  const client = new Client({
    auth
  })
  const notionRawBlogPosts = await getNotionBlogPosts(client, RootBlockID);
  const notionBlogPosts = await Promise.all(notionRawBlogPosts.map(async blogPostOGData => {
    const rawBlogPostData = await retrievePageMetadata(client, get(blogPostOGData, "id"));
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
  const deletingBlogPosts = [
    ...currentBlogPosts.filter(item => get(JSON.parse(item.data), "type") === BlogPostSource.NOTION && !notionBlogPosts.find(post => post.id === item.id)),
  ]
  await Promise.all(newBlogPosts.map(async item => {
    const data = {
      rawData: item,
      attributes: get(item, "attributes", {}),
      immutability: ["ARCHIVED"],
      url: get(item, "attributes.url"),
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
        status: get(item, "attributes.archived", true) ? "ARCHIVED" : "PUBLISHED",
        updatedAt: get(item, "attributes.updatedAt"),
      }
    }

    return await signedGraphQLMutationRequest(createPost, variables);
  }));

  await Promise.all(updatingBlogPosts.map(async item => {
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

  await Promise.all(deletingBlogPosts.map(async item => {
    const variables = {
      input: {
        id: get(item, "id")
      }
    }

    return await signedGraphQLMutationRequest(deletePost, variables);
  }));
}


exports.handler = async () => {

  const currentBlogPosts = await queryGraphQLData(listBlogPost, { limit: 10000 }, "data.data.listPosts.items")

  await synchronizeNotionBlogPosts(currentBlogPosts);

  return { errors: [] };
};

