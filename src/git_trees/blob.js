import { github } from "@actions/github";

class Blob{
    constructor(Name, GHToken, repo, owner) {
        this.octokit = github.getOctokit(GHToken);
        this.Name = Name;
        this.repo = repo;
        this.owner = owner;
    };

    async CreateBlob(filepath, content, encoding) {
        const file = await this.octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
            owner: this.owner,
            repo: this.repo,
            content: content,
            encoding: encoding
        });
        return {
            path: filepath,
            sha: file.sha,
            mode: "100644",
            type: "blob"
        }
    };
};

export default Blob;