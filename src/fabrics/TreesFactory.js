const AbstractFactory = require("./AbstractFactory");
const GitTree = require("../git_trees/tree");

class TreesFactory extends AbstractFactory{
    CreateInstance(GHToken, repo, owner) {
        return new GitTree(GHToken, repo, owner)
    };
};

module.exports = TreesFactory;