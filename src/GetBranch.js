const github = require('@actions/github');

// use an async function for the main tasks
class CreateBranch{
    constructor() {
        this.inputs = {};
    };

    setup(inputs) {
        for(const [key, value] of Object.entries(inputs)) {
            this.inputs[key] = value;
        };
        this.octokit = github.getOctokit(this.inputs.GITHUB_TKN);
    };

    setLogger({notice, info, output, warning, error}) {
        this.notice = notice;
        this.info = info;
        this.output = output;
        this.warning = warning;
        this.error = error;
    };

    async run() {
        try {
            this.warning(`ref of main branch: ${(await this.CreateBranch()).toString()}`)
        } catch (error) {

        }
    };

    async CreateBranch() {
        try {

            const owner = this.inputs.OWNER;
            const repo =  this.inputs.REPO;
            const mainBranch = this.inputs.MAIN_BRANCH;
            const targetBranch = this.inputs.TARGET_BRANCH
            let MainBranchSHA = await this.octokit.request("GET /repos/{owner}/{repo}/git/refs/{ref}", {
                owner: owner,
                repo: repo,
                ref: `heads/${mainBranch}`
            });

            let NewBranchCreation = await this.octokit.request('POST /repos/{owner}/{repo}/git/refs', {
                owner: owner,
                repo: repo,
                ref: `refs/heads/${targetBranch}`,
                sha: MainBranchSHA.data.object.sha
            });

            this.info(`HTTP status of main branch: ${MainBranchSHA.status}`);
            this.info(`SHA of main branch: ${MainBranchSHA.data.object.sha}`);
            return NewBranchCreation.data.ref

        } catch (error) {
            throw error;
        }
    };
}

module.exports = CreateBranch;