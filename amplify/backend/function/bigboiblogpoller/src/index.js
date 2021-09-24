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

const RootBlockID = process.env.NOTION_BLOGPOST_BLOCKID;
const auth = process.env.NOTION_INTEGRATION_TOKEN;

const getNotionBlogPosts = async (client) => {
    const rawData = await client.blocks.children.list({ block_id: RootBlockID });
    return get(rawData, "results", []).filter(item => item.type === "child_page");
}

const retrievePageData = async (client, pageID) => {
    const rawBlogPostData = await client.blocks.children.list({ block_id: pageID, page_size: 100 });
    let next_cursor = get(rawBlogPostData, "next_cursor", null);
    let has_more = get(rawBlogPostData, "has_more", false);
    while (has_more && next_cursor) {
        const nextData = await client.blocks.children.list({ block_id: pageID, page_size: 100, next_cursor });
        get(rawBlogPostData, "results", []).push(...get(nextData, "results", []));
        next_cursor = get(nextData, "next_cursor", null);
        has_more = get(nextData, "has_more", false);
    }
    return rawBlogPostData
}

exports.handler = async (event) => {
    const client = new Client({ 
        auth
    })
    const notionBlogPosts = await getNotionBlogPosts(client);

    const blogPosts = await Promise.all(notionBlogPosts.map(async blogPostOGData => {
        const rawBlogPostData = await retrievePageData(client, get(blogPostOGData, "id"));
        console.log(JSON.stringify(rawBlogPostData, null, 4));
    }));

    return { errors: [] };
};

