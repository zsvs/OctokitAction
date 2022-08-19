import AbstractFactory from "./AbstractFactory";
import GitTree from "../git_trees/tree";

class TreesFactory extends AbstractFactory{
    CreateInstance(GHToken, repo, owner) {
        return new GitTree(GHToken, repo, owner)
    };
};

export default TreesFactory;