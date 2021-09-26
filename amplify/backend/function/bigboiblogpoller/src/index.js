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

const { getNotionBlogPosts, retrievePageMetadata } = require("./Notion");

const RootBlockID = process.env.NOTION_BLOGPOST_BLOCKID;
const auth = process.env.NOTION_INTEGRATION_TOKEN;

exports.handler = async () => {
    const client = new Client({ 
        auth
    })
    const notionBlogPosts = await getNotionBlogPosts(client, RootBlockID);

    const blogPosts = await Promise.all(notionBlogPosts.map(async blogPostOGData => {
        const rawBlogPostData = await retrievePageMetadata(client, get(blogPostOGData, "id"));
        console.log(JSON.stringify(rawBlogPostData, null, 4));
        return rawBlogPostData
    }));

    return { errors: [], data: blogPosts };
};

