import { core } from "@actions/core";
import  CreateBranch  from "./GetBranch";

(async () =>{
    try {
        const inputs = {
            REPO: core.getInput("repo").trim(),
            OWNER: core.getInput("owner").trim(),
            GITHUB_TKN: core.getInput("github_tkn").trim(),
            TARGET_BRANCH: core.getInput("target_branch").trim(),
            FILES: core.getInput("files").trim(),
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