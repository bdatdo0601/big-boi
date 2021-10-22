const SCHEMA = require("../schema/github_webhooks.json");
const EXAMPLE = require("./github_webhooks_example.json");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({
    strict: true,
    strictTypes: true,
    strictTuples: true,
    allErrors: true,
});
  
addFormats(ajv);
ajv.addKeyword("tsAdditionalProperties");

ajv.addSchema(SCHEMA);

Object.keys(SCHEMA.definitions)
    .filter(key => key.includes("$")) // only use event with action
    .forEach(key => {
        const schema = ajv.getSchema(`#/definitions/${key}`)
        const result = schema(EXAMPLE);
        if (result) {
            console.log(key);
            console.log(result);
        }
    })