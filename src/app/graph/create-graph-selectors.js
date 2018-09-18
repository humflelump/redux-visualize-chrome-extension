import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as functions from './functions';
import * as constants from './constants';
import _ from 'underscore';
import Graph from '../classes/graph';
import Node from '../classes/node';
import RectangleManager from '../classes/rectangle-list';

const serializableFlatGraph = state => state.Graph.graph;
const hoveredNode = state => state.Graph.hoveredNode;
const clickedNodes = state => state.Graph.clickedNodes;
const filterOption = state => state.Graph.filterOption;

function getSelectedNodes(serializableFlatGraph, clickedNodes) {
    if (clickedNodes.size === 0) return serializableFlatGraph;
    const correctedDependencies = serializableFlatGraph.map((d) => {
        return {
            ...d,
            dependencies: d.dependencies.filter(n => clickedNodes.has(n)),
        }
    });
    return correctedDependencies.filter(d => clickedNodes.has(d.id));
}
export const selectedNodes = createSelector([serializableFlatGraph, clickedNodes], getSelectedNodes);

function makeGraph(flatGraph) {
    const nodes = flatGraph.map((d) => {
        return {
            data: d,
            dependencies: [],
        };
    });
    const indexed = _.indexBy(nodes, d => d.data.id);
    for (const node of nodes) {
        node.dependencies = node.data.dependencies.map((id) => {
            return indexed[id];
        });
    }
    return nodes;
}
export const graph = createSelector([selectedNodes], makeGraph);

function getIndexedNodes(graph) {
    const result = _.indexBy(graph, d => d.data.id);
    return result;
}
export const indexedNodes = createSelector([graph], getIndexedNodes);


function getRoots(graph) {
    const set = new Set();
    for (const node of graph) {
        for (const id of node.data.dependencies) {
            set.add(id);
        }
    }
    const result = graph.filter((node) => {
        return !set.has(node.data.id);
    });
    result.forEach(node => functions.giveNodeDepth(node));
    result.forEach(node => functions.giveNodeMinDepth(node));
    return result;
}
export const rootNodes = createSelector([graph], getRoots);

function flattenGraph(rootNodes) {
    const result = functions.flattenGraph(rootNodes);
    console.log('flat graph', result);
    return result;
}
export const flatGraph = createSelector([rootNodes], flattenGraph);

function createGraph(flatGraph) {
    const nodes = flatGraph.map(d => {
        return new Node(d.data, d.data.id);
    });
    const graph = new Graph(nodes);
    const rects = new RectangleManager(graph);

    return rects;
}
export const graph_ = createSelector([flatGraph], createGraph);

function getNodesWithCoordinates(flatGraph) {
    const grouping = _.groupBy(flatGraph, d => d.root.data.id);
    _.values(grouping).forEach(L => functions.giveTreeCoordinates(L));
    return flatGraph;
}
export const nodesWithCoordinates = createSelector([flatGraph], getNodesWithCoordinates);

function getRectangles(nodesWithCoordinates) {
    return functions.createTreeOfRectangles(nodesWithCoordinates);
}
export const rectangles = createSelector([nodesWithCoordinates], getRectangles);

function getHoveredDependencies(rootNodes, hoveredNode) {
    if (hoveredNode === null) return new Set();
    return functions.getDependencies(rootNodes, hoveredNode);
}
export const hoveredDependencies = createSelector([rootNodes, hoveredNode], getHoveredDependencies);

function getHoveredDependants(rootNodes, hoveredNode) {
    if (hoveredNode === null) return new Set();
    return functions.getDependants(rootNodes, hoveredNode);
}
export const hoveredDependants = createSelector([rootNodes, hoveredNode], getHoveredDependants);

function getHighlightedNodes(filterOption, hoveredDependants, hoveredDependencies) {
    switch (filterOption) {
        case constants.DEPENDANCIES:
            return hoveredDependencies;
        case constants.DEPENDANTS:
            return hoveredDependants;
        case constants.BOTH:
            return new Set([...hoveredDependants, ...hoveredDependencies]);
        case constants.NEITHER:
            return new Set();
        default:
            return new Set();
    }
}
export const highlightedNodes = createSelector([filterOption, hoveredDependants, hoveredDependencies], getHighlightedNodes);
