const github = require('@actions/github');
const core = require("@actions/core");

class Blob{
    constructor(Name, GHToken, repo, owner) {
        core.warning("New Blob object created");
        this.octokit = github.getOctokit(GHToken);
        this.Name = Name;
        this.repo = repo;
        this.owner = owner;
    };

    async CreateBlob(filepath, content, encoding) {
        // try{
            core.warning("Blob creation process started");
            const file = await this.octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
                owner: this.owner,
                repo: this.repo,
                content: content,
                encoding: encoding
            });
            core.warning(`File created: ${file.sha}`);
            const treeBlobStructure = {
                path: filepath,
                sha: file.sha,
                mode: "100644",
                type: "blob"
            };
            core.warning(`Blob struct: ${treeBlobStructure.path} ${treeBlobStructure.sha} ${treeBlobStructure.mode} ${treeBlobStructure.type}`);
            return treeBlobStructure;
        // } catch (error) {
        //     throw error;
        // }
    };
};

module.exports = Blob;