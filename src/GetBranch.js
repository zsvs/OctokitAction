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

            // if ((await this.CheckBranch()).status != 200) {
            //     this.warning("Start Creating branch");
            //     this.warning(`ref of main branch: ${(await this.CreateBranch()).toString()}`);
            //     this.warning(`sha of created file: ${(await this.CreateFile()).toString()}`);
            // } else {
            //     this.warning(`Branch ${this.inputs.TARGET_BRANCH} is already exists`);
            //     return `Branch ${this.inputs.TARGET_BRANCH} is already exists`;
            // }
            // let ListBr = await this.GetListBranches();
            this.warning(`List of branches ${(await this.GetListBranches())[0]}`);

            let NewList = [];
            (await this.GetListBranches()).forEach(element => {
                NewList.push(element.name)
            });

            this.warning(`NewList contain: ${NewList}`);
        } catch (error) {
            throw error;
        }
    };

    async CreateBranch() {
        try {

            const owner = this.inputs.OWNER;
            const repo =  this.inputs.REPO;
            const targetBranch = this.inputs.TARGET_BRANCH;
            let MainBranchName = await this.octokit.request("GET /repos/{owner}/{repo}", {
                owner: owner,
                repo: repo,
            });

            let MainBranchSHA = await this.octokit.request("GET /repos/{owner}/{repo}/git/refs/{ref}", {
                owner: owner,
                repo: repo,
                ref: `heads/${MainBranchName.data.default_branch}`
            });

            let NewBranchCreation = await this.octokit.request('POST /repos/{owner}/{repo}/git/refs', {
                owner: owner,
                repo: repo,
                ref: `refs/heads/${targetBranch}`,
                sha: MainBranchSHA.data.object.sha
            });

            this.info(`HTTP status of main branch: ${MainBranchSHA.status}`);
            this.info(`SHA of main branch: ${MainBranchSHA.data.object.sha}`);
            return NewBranchCreation.data.ref;

        } catch (error) {
            throw error;
        }
    };

    async CreateFile() {
        try {

            const owner = this.inputs.OWNER;
            const repo =  this.inputs.REPO;
            const targetBranch = this.inputs.TARGET_BRANCH;
            const file = this.inputs.FILE;

            let FileCreated = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: owner,
                repo: repo,
                path: file,
                branch: targetBranch,
                message: 'my commit message',
                committer: {
                  name: 'zsvs',
                  email: 'stepanezc@gmail.com'
                },
                content: 'bXkgbmV3IGZpbGUgY29udGVudHM='
              });
            this.info(`File path: ${FileCreated.data.content.path}`);
            return FileCreated.data.commit.sha;
        } catch (error) {
            throw error;
        }
    };

    async GetListBranches() {
        const owner = this.inputs.OWNER;
        const repo =  this.inputs.REPO;
        let ListBranches = await this.octokit.request('GET /repos/{owner}/{repo}/branches', {
            owner: owner,
            repo: repo
          });

        let branches = [];
        ListBranches.data.forEach(element => {
            branches.push(element.name)
        });
        this.info(`List of branches: ${branches.toString}`)
        return branches;
    };

    async CheckBranch() {
        const owner = this.inputs.OWNER;
        const repo =  this.inputs.REPO;
        const targetBranch = this.inputs.TARGET_BRANCH;
        let BranchStatus = await this.octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
            owner: owner,
            repo: repo,
            branch: targetBranch
                });
        this.info(`Branch ${targetBranch} status: ${BranchStatus.status}`);
        return BranchStatus;

    };
}

module.exports = CreateBranch;
