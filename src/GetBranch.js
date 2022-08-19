﻿import { getOctokit } from '@actions/github';
import TreesFactory from './fabrics/TreesFactory';
import FileFactory from './fabrics/FileFactory';

// use an async function for the main tasks
class CreateBranch{
    constructor() {
        this.inputs = {};
    };

    setup(inputs) {
        for(const [key, value] of Object.entries(inputs)) {
            this.inputs[key] = value;
        };
        this.octokit = getOctokit(this.inputs.GITHUB_TKN);
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
            this.info(`Test input value: ${this.inputs.TEST_INPUT}`)
            if (this.inputs.TEST_INPUT.length == 0) {
                this.warning("No TEST_INPUT passed");
            }

            // this.warning(`List of branches ${await this.GetListBranches()}`);
            const NewList = await this.GetListBranches();
            // this.warning(`Branches is: ${NewList}`);

            if (NewList.includes(this.inputs.TARGET_BRANCH)){
                this.warning(`Branch ${this.inputs.TARGET_BRANCH} is already exists`);
                this.notice(`Update file: ${this.inputs.FILE}`);
                this.warning(`SHA of updated file: ${(await this.CreateFile()).toString()}`);
            } else {
                this.info("Start Creating branch");
                this.warning(`ref of branch: ${(await this.CreateBranch()).toString()}`);
                this.warning(`sha of created file: ${(await this.CreateFile()).toString()}`);
            }

            this.warning("BULK COMMIT AHEAD");
            const FilesToCommit = [this.inputs.file1, this.inputs.file2];
            this.CreateBulkCommit(this.inputs.GITHUB_TKN, FilesToCommit, "Test bulk commit", this.inputs.content, this.inputs.TARGET_BRANCH);
        } catch (error) {
            throw error;
        }
    };

    async CreateBranch() {
        try {

            const owner = this.inputs.OWNER;
            const repo =  this.inputs.REPO;
            const targetBranch = this.inputs.TARGET_BRANCH;
            const MainBranchSHA = await GetMainSHA();

            const NewBranchCreation = await  this.octokit.request('POST /repos/{owner}/{repo}/git/refs', {
                owner: owner,
                repo: repo,
                ref: `refs/heads/${targetBranch}`,
                sha: MainBranchSHA
            });

            this.info(`HTTP status of main branch: ${MainBranchSHA.status}`);
            this.info(`SHA of main branch: ${MainBranchSHA.data.object.sha}`);
            return NewBranchCreation.data.ref;

        } catch (error) {
            throw error;
        }
    };

    async CreateFile(updateFile) {
        try {

            const owner = this.inputs.OWNER;
            const repo =  this.inputs.REPO;
            const targetBranch = this.inputs.TARGET_BRANCH;
            const file = this.inputs.FILE;
            const mycontent = this.inputs.CONTENT;

            this.warning(`Content b64:${Buffer.from(mycontent).toString("base64")}`);
            const refResponse = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}{?ref}', {
                owner: owner,
                repo: repo,
                path: file,
                ref: targetBranch
              });

            const FileCreated = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: owner,
                repo: repo,
                path: file,
                branch: targetBranch,
                message: 'my commit message',
                sha: refResponse.data.sha,
                committer: {
                  name: 'zsvs',
                  email: 'stepanezc@gmail.com'
                },
                content: Buffer.from(mycontent).toString("base64")
              });
            this.info(`File path: ${FileCreated.data.content.path}`);
            return FileCreated.data.commit.sha;
        } catch (error) {
            const owner = this.inputs.OWNER;
            const repo =  this.inputs.REPO;
            const targetBranch = this.inputs.TARGET_BRANCH;
            const file = this.inputs.FILE;
            const mycontent = this.inputs.CONTENT;

            this.warning(`Content b64:${Buffer.from(mycontent).toString("base64")}`);
            const FileCreated = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: owner,
                repo: repo,
                path: file,
                branch: targetBranch,
                message: 'my commit message',
                committer: {
                  name: 'zsvs',
                  email: 'stepanezc@gmail.com'
                },
                content: Buffer.from(mycontent).toString("base64")
              });
            this.info(`File path: ${FileCreated.data.content.path}`);
            return FileCreated.data.commit.sha;
        }
    };
    async GetMainSHA() {
        const owner = this.inputs.OWNER;
        const repo =  this.inputs.REPO;
        const MainBranchName = await this.octokit.request("GET /repos/{owner}/{repo}", {
            owner: owner,
            repo: repo,
        });

        const MainBranchSHA = await this.octokit.request("GET /repos/{owner}/{repo}/git/refs/{ref}", {
            owner: owner,
            repo: repo,
            ref: `heads/${MainBranchName.data.default_branch}`
        });

        return MainBranchSHA.data.object.sha
    };

    async CreateBulkCommit(GHToken, filepath, message, contentList, trunk) {

        BlobsFabric = new FileFactory();
        let BlobsList = [];

        const encoding = "utf-8";
        filepath.forEach(filename => {
            contentList.forEach(content => {
                BlobsList.push(BlobsFabric.CreateInstance(filename, GHToken, repo, owner).CreateBlob(filename, content, encoding));
            });
        });

        TreesFabric = new TreesFactory();
        TreesFabric.CreateInstance(GHToken, repo, owner).CreateTree(BlobsList, message, trunk)
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
        this.info(`List of branches: ${branches}`)
        return branches;
    };
}

export default CreateBranch;
