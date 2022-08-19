import { core } from "@actions/core";
import  CreateBranch  from "./GetBranch";

(async () =>{
    try {
        const inputs = {
            REPO: core.getInput("repo").trim(),
            OWNER: core.getInput("owner").trim(),
            GITHUB_TKN: core.getInput("github_tkn").trim(),
            TARGET_BRANCH: core.getInput("target_branch").trim(),
            FILE1: core.getInput("file1").trim(),
            FILE2: core.getInput("file2").trim(),
            TEST_INPUT: core.getInput("test_input").trim(),
            CONTENT: core.getInput("content").trim(),

        };

        const actionOcto = new CreateBranch();
        actionOcto.setup(inputs);
        actionOcto.setLogger({
            notice: core.notice,
            info: core.info,
            output: core.setOutput,
            warning: core.warning,
            error: core.error,
        });

        await actionOcto.run();

    } catch (error) {
        console.error(error);
        core.setFailed(error);
        throw error;
    }
})();