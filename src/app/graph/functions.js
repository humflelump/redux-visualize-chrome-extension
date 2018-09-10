import _ from 'underscore';
import * as d3 from 'd3';

export function getDependants(roots, id) {
    const set = new Set();
    roots.forEach((root) => {
        getDependantsHelper(root, id, set)
    });
    return set;
}

function getDependantsHelper(node, id, nodes) {
    if (node.data.id === id) {
        nodes.add(node.data.id);
        return true;
    }
    const bool = _.any(node.dependencies.map((d) => {
        return getDependantsHelper(d, id, nodes);
    }));
    if (bool) nodes.add(node.data.id);
    return bool;
}

export function getDependencies(roots, id) {
    const nodes = new Set();
    roots.forEach((root) => {
        getDependenciesHelper(root, id, false, nodes)
    });
    return nodes;
}

function getDependenciesHelper(node, id, found, set) {
    if (node.data.id === id) {
        found = true;
    }
    if (found === true) {
        set.add(node.data.id);
    }
    for (const child of node.dependencies) {
        getDependenciesHelper(child, id, found, set)
    }
}

export function giveNodeDepth(node) {
    giveNodeDepthHelper(node, 0, node);
}

function giveNodeDepthHelper(node, depth, root) {
    if (node.depth === undefined || depth > node.depth) {
        node.depth = depth;
        node.root = root;
    }
    for (const child of node.dependencies) {
        giveNodeDepthHelper(child, depth + 1, root);
    }
}

export function giveNodeMinDepth(node) {
    giveNodeMinDepthHelper(node, 0, node)
}

function giveNodeMinDepthHelper(node, depth, root) {
    if (node.root === root) {
        if (node.minDepth === undefined || node.minDepth > depth) {
            node.minDepth = depth;
        }
    }
    for (const child of node.dependencies) {
        giveNodeMinDepthHelper(child, depth + 1, root);
    }
}

export function flattenGraph(roots) {
    const list = [];
    const s = new Set();
    roots.forEach(n => flattenGraphHelper(n, list, s));
    return list;
}

function flattenGraphHelper(node, list, idSet) {
    if (!idSet.has(node.data.id)) {
        idSet.add(node.data.id);
        list.push(node);
    }
    for (const child of node.dependencies) {
        flattenGraphHelper(child, list, idSet)
    }
}

export function giveTreeCoordinates(nodes) {
    const group = _.groupBy(nodes, 'minDepth');
    const minDepths = _.keys(group);
    minDepths.forEach((minDepth) => {
        const list = group[minDepth];
        list.forEach((node, index) => {
            node.x = index;
            node.y = node.depth;
        });
    });
}

const PADDING = 30;
const HEIGHT = 80;
const WIDTH = 130;

function getDimensions(node) {
    return {
        width: 100,
        height: HEIGHT,
    }
}

function getYForDepth(depth) {
    return PADDING + (HEIGHT + PADDING) * depth;
}

function getNextRow(nodes, visited) {
    return _.flatten(nodes.map(n => n.dependencies)).filter((node) => {
        const bool = !visited.has(node.data.id);
        visited.add(node.data.id)
        return bool;
    });
}

function getWidthOfRow(row) {
    const widths = row.map(n => getDimensions(n).width);
    return d3.sum(widths) + (widths.length + 1) * PADDING;
}

function getWidth(nodes) {
    const group = _.countBy(nodes, d => d.minDepth);
    const max = d3.max(_.values(group));
    return max * WIDTH + (max + 1) * PADDING;
}

function applyTransformOnRectangles(rectangles, dx, dy) {
    return rectangles.map((rect) => {
        return {
            ...rect,
            x: rect.x + dx,
            y: rect.y + dy,
        };
    });
}

function createBranchOfRectangles(nodes) {
    const rects = [];
    const group = _.groupBy(nodes, d => d.minDepth);
    console.log('group', group);
    const width = getWidth(nodes);
    _.values(group).forEach((row, index) => {
        const L = row.length;
        const padding = (width - L * WIDTH) / (L + 1);
        let x = padding;
        for (const node of row) {
            const rectangle = {
                data: node.data,
                x: x,
                y: node.y * (PADDING + HEIGHT) + PADDING,
                width: WIDTH,
                height: HEIGHT,
            };
            rects.push(rectangle);
            x += (padding + WIDTH);
        }
    });
    return rects;
}

export function createTreeOfRectangles(nodes) {
    const group = _.groupBy(nodes, d => d.root.data.id);
    const branches = _.values(group);
    const rectBranches = [];
    let x = 0;
    for (const branch of branches) {
        const rectBranch = createBranchOfRectangles(branch);
        const rectBranch_ = applyTransformOnRectangles(rectBranch, x, 0);
        x += getWidth(branch);
        rectBranches.push(rectBranch_);
    }
    return _.flatten(rectBranches);
}

export function getArrowStart(rectangle) {
    return {
        x: rectangle.x + rectangle.width / 2,
        y: rectangle.y + rectangle.height,
    };
}

export function getArrowEnd(rectangle) {
    return {
        x: rectangle.x + rectangle.width / 2,
        y: rectangle.y + rectangle.height / 2,
    };
}