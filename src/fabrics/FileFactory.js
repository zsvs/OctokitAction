const AbstractFactory = require("./AbstractFactory");
const Blob = require("../git_trees/blob");

class FileFactory extends AbstractFactory{
    CreateInstance(Name, GHToken, repo, owner) {
        return new Blob(Name, GHToken, repo, owner)
    };
};

module.exports = FileFactory;