const { capitalize } = require("lodash");
const { readdirSync } = require("fs");
const { resolve } = require("path")
const dot = require("dot-object");

const processorsDir = resolve(__dirname, "Processors");

const getEventTypeProcessorsFromDir = (rootDir, objectPath = "") => {
    const eventTypes = {};
    const entities = readdirSync(rootDir, { withFileTypes: true });
    for (const entity of entities) {
        // will ignore any non-capitalize file name (for future code refactor)
        if (entity.name[0] !== capitalize(entity.name)[0]) {
            continue;
        }
        const entityName = entity.name.split(".")[0];
        const entityPath = objectPath ? [objectPath, entityName].join(".") : entityName;
        const entityDirPath = [rootDir, entityName].join("/");
        if (entity.isDirectory()) {
            const childEventTypes = getEventTypeProcessorsFromDir(entityDirPath, entityPath);
            Object.entries(childEventTypes).forEach(([key, value]) => { eventTypes[key] = value });
        } else {
            const data = require(entityDirPath);
            Object.entries(data).forEach(([key, value]) => { eventTypes[`${entityPath}.${key}`] = value });
            eventTypes[`${entityPath}.eventType`] = entityPath;
        }
    }
    return objectPath ? eventTypes : dot.object(eventTypes);
}
const EventTypeProcessors = getEventTypeProcessorsFromDir(processorsDir);
console.log(JSON.stringify(EventTypeProcessors, null, 4));
exports.EventTypeProcessors = EventTypeProcessors;
