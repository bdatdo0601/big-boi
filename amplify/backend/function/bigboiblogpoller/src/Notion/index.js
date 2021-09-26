const { range, get } = require("lodash");
const moment = require("moment");

exports.getNotionBlogPosts = async (client, block_id) => {
    const rawData = await client.blocks.children.list({ block_id });
    return get(rawData, "results", []).filter(item => item.type === "child_page");
}

const PropertyConverter = {
    title: (data) => get(data, "title", []).map(item => get(item, "plain_text", "")).join("") || "Untitled",
}

exports.retrievePageMetadata = async (client, pageID) => {
    const rawBlogPostData = await client.pages.retrieve({ page_id: pageID });
    const BlogPostAttributes = {
        ...Object.entries(PropertyConverter).reduce((acc, [key, converter]) => ({
            ...acc,
            [key]: converter(get(rawBlogPostData, `properties.${key}`))
        }), {}),
        archived: get(rawBlogPostData, "archived", true),
        type: "Notion",
        id: get(rawBlogPostData, "id"),
        url: get(rawBlogPostData, "url"),
        createdAt: moment(get(rawBlogPostData, "created_time")).toISOString(),
        updatedAt: moment(get(rawBlogPostData, "last_edited_time")).toISOString(),
    }
    return { ...rawBlogPostData, attributes: BlogPostAttributes };
}


exports.retrievePageData = async (client, pageID) => {
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


const textFormatter = (textData) => {
    const result = [get(textData, "plain_text", "")]
    // annotation formatter
    const annotations = {
        bold: "*",
        italic: "**",
        strikethrough: "~",
        underline: "_",
        code: "`"
    };
    Object.entries(annotations).forEach(([annotation, symbol]) => {
        if (get(textData, `annotiations.${annotation}`, false)) {
            result.push(symbol);
            result.unshift(symbol);
        }
    })
    // link formatter
    if (get(textData, "href")) {
        result.unshift("[");
        result.push(`](${get(textData, "href")})`);
    }
    return result.join("");
};

const headerFormatter = (data, level) => {
    const result = range(level).map(() => "#");
    result.push(" ");
    result.push(...get(data, "text", []).map(textItemData => textFormatter(textItemData)));
    return result.join("");
};

const NotionBlockTypeToMarkdownConverter = {
    heading_1: data => headerFormatter(data, 1),
    heading_2: data => headerFormatter(data, 2),
    heading_3: data => headerFormatter(data, 3),
    heading_4: data => headerFormatter(data, 4),
    heading_5: data => headerFormatter(data, 5),
    heading_6: data => headerFormatter(data, 6)
}

const notionBlocksToMarkdown = async (blocks) => {
    const result = [];
    const filteredBlocks = blocks.filter(item => !item.archived);
    for (const block of filteredBlocks) {
        console.log(JSON.stringify(block, null, 4));
        const blockType = get(block, "type");
    }
};

exports.notionBlocksToMarkdown = notionBlocksToMarkdown;