const core = require('@actions/core');
const github = require('@actions/github');

// use an async function for the main tasks
async function main() {

    // get the GITHUB_TOKEN from input and use it to create an octokit client
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);
}