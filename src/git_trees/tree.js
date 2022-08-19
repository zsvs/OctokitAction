const github = require('@actions/github');
const core = require("@actions/core");

class GitTree{
    constructor(GHToken, repo, owner) {
        core.warning("New GitTree object created");
        this.octokit = github.getOctokit(GHToken);
        this.repo = repo;
        this.owner = owner;
    };

    async CreateTree(BlobList, message, trunk) {
        core.warning(`Tree creation process started:`);
        core.warning("Tree creation: Get main branch name");
        const MainBranchName = await this.octokit.request("GET /repos/{owner}/{repo}", {
            owner: this.owner,
            repo: this.repo
        });

        core.warning("Tree creation: Get main branch SHA");
        const MainBranchSHA = await this.octokit.request("GET /repos/{owner}/{repo}/git/refs/{ref}", {
            owner: this.owner,
            repo: this.repo,
            ref: `heads/${MainBranchName.data.default_branch}`
        });

        core.warning("Defining tree structure");
        this.tree = await this.octokit.request("POST /repos/{owner}/{repo}/git/trees", {
            owner: this.owner,
            repo: this.repo,
            base_tree: MainBranchSHA.data.object.sha,
            tree: BlobList
        });

        core.warning(`Create commit; Tree status from prev: ${this.tree.status}`);
        const commit = await this.octokit.request("POST /repos/{owner}/{repo}/git/commits", {
            owner: this.owner,
            repo: this.repo,
            message: message,
            tree: this.tree.sha //,
            // parents: [MainBranchSHA.data.object.sha]
        });
        core.warning(`Commit for tree: ${commit.data.sha}`);

        core.warning(`Updating ref`);
        await this.octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
            owner: this.owner,
            repo: this.repo,
            ref: `heads/${trunk}`
        });
    };
};

module.exports = GitTree;