const axios = require("axios");
const poll = require('@jcoreio/poll');

exports.PersonalPublishInfo = {
    subject: "Dat",
    subjectLink: "https://www.dat.do/",
    githubHandle: "bdatdo0601",
}

exports.redeployBlogSite = async (url = process.env.BLOG_DEPLOY_WEBHOOK, checkToken = process.env.BLOG_DEPLOY_TOKEN) => {
    const response = await axios({
        url,
        method: "POST"
    });
    console.info("Requested blog re-deployment", response);

   const res = await poll(async ({ pass }) => {
        const r = await axios({
            headers: {
                'Authorization': `Bearer ${checkToken}`
            },
            url: `https://api.vercel.com/v6/deployments?limit=1&projectId=${process.env.BLOG_DEPLOY_PROJECT_ID}&meta-githubCommitRef=${process.env.BLOG_DEPLOY_BRANCH}`,
            method: "GET",
        })
        console.info("Polling Blog Site Deployment Status", r.data);
        const deployment = r.data.deployments[0];
        if (["ERROR", "CANCELED", "READY"].includes(deployment.state)) {
            pass(r);
        }
    }, 2500).timeout(40000);

    return res;
}