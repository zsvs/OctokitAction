import AbstractFactory from "./AbstractFactory";
import Blob from "../git_trees/blob";

class FileFactory extends AbstractFactory{
    CreateInstance(Name, GHToken, repo, owner) {
        return new Blob(Name, GHToken, repo, owner)
    };
};

export default FileFactory;