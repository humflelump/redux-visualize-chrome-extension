

export default class Node {
    constructor(data, id) {
        this.data = data;
        this.id = id;

        this.children = [];
        this.parents = [];
        this.indexedChildren = {};
        this.indexedParents = {};

        this.depth = null;
        this.minDepth = null;
        this.rectangle = null;
    }

    addChild(node) {
        if (!(node.id in this.indexedChildren)) {
            this.children.push(node);
            this.indexedChildren[node.id] = node;
        }
    }

    addParent(node) {
        if (!(node.id in this.indexedParents)) {
            this.parents.push(node);
            this.indexedParents[node.id] = node;
        }
    }
}