import _ from 'underscore';
import * as d3 from 'd3';
import * as constants from './constants';

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

function addBranch(node, list, index = 0) {
    if (index >= list.length) return;
    const str = list[index];
    if (!node[str]) node[str] = {};
    addBranch(node[str], list, index+1);
}

export function removeNonLeafStateVariables(nodes) {
    const stateNodes = nodes.filter(d => d.type === constants.STATE_VARIABLE);
    const names = [...new Set(stateNodes.map(d => d.name))];
    const tree = {};
    for (const name of names) {
        const split = name.split('.');
        addBranch(tree, split);
    }
    const idsToExclude = stateNodes.filter((node) => {
        const split = node.name.split('.');
        let obj = tree;
        for (const str of split) {
            obj = obj[str];
        }
        return !_.isEmpty(obj); // means its a root
    }).map(d => d.id);
    const idSet = new Set(idsToExclude);
    const result = nodes
        .filter(d => !idSet.has(d.id))
        .map(d => {
            return {
                ...d,
                dependencies: d.dependencies
                .filter(id => !idSet.has(id)),
            };
        });
    return result;
}