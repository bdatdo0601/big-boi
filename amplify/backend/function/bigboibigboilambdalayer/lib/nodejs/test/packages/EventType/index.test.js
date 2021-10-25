const assert = require("assert");

const { formatEventByEventType } = require("../../../../../opt/packages/EventType")
const ExampleEvent = require("./examples/GithubWebhookExampleEvent.json");

describe("EventType", () => {
    describe("GitHubWebhook", () => {
        it("should match a message schema", async () => {
            const event = await formatEventByEventType(ExampleEvent, "GithubWebhook");
            assert(event.publishInfo);
            assert.notEqual(event.publishInfo, {});
        })
    })
})