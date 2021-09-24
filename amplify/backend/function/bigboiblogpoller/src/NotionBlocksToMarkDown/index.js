const { range, toNumber } = require("lodash");

const textFormatter = () => {
    // annotation formatter
    const annotations = {
        bold: "*",
        italic: "**",
        strikethrough: "~",
        underline: "_",
        code: "`"
    };
    // link formatter
};

const headerFormatter = (data, level) => {
    const result = range(level).map(() => "#");
    result.push(" ");

};

const NotionBlockTypeToMarkdownConverter = {
    heading_1: data => "",
    heading_2: data => "",
    heading_3: data => ""
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