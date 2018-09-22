import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import _ from 'underscore';
import Graph from '../classes/graph';
import Node from '../classes/node';

const selectedNodeId = state => state.ContextMenu.selectedNodeId;
const settingsOpen = state => state.Graph.settingsOpen;
const serializableFlatGraph = state => state.Graph.graph;
const filterType = state => state.ContextMenu.filterType;

function createGraph(flatGraph) {
    const nodes = flatGraph.map(d => {
        return new Node(d, d.id);
    });
    const graph = new Graph(nodes);
    return graph.nodes;
}
export const nodes = createSelector([serializableFlatGraph], createGraph);

function getSelectedNode(selectedNodeId, nodes) {
    const node = nodes.find(n => n.id === selectedNodeId);
    return node || null;
}
export const selectedNode = createSelector([selectedNodeId, nodes], getSelectedNode);

function filterNodes(nodes, selectedNode, filterType) {
    
    const make = (nodes) => {
        const n = nodes.map(d => new Node(d.data, d.id));
        const ids = new Set(n.map(d => d.id));
        n.forEach((d) => {
            d.data = {
                ...d.data,
                dependencies: d.data.dependencies
                    .filter(id => ids.has(id)),
            };
        });
        return (new Graph(n)).nodes
    }

    if (filterType === constants.NO_FILTER) {
        return nodes;
    } else if (filterType === constants.DEPENDENCIES_FILTER) {
        return make(selectedNode.getDependencies());
    } else if (filterType === constants.DEPENDENTS_FILTER) {
        return make(selectedNode.getDependents());
    }
    const both = [...selectedNode.getDependents(), ...selectedNode.getDependencies()];
    return make(_.uniq(both, d => d.id));
}
export const filteredNodes = createSelector([nodes, selectedNode, filterType], filterNodes);

function getIfMenuIsOpen(selectedNode) {
    return selectedNode !== null;
}
export const isMenuOpen = createSelector([selectedNode], getIfMenuIsOpen);

function getDimensions(isMenuOpen, settingsOpen) {
    return {
        bottom: isMenuOpen ? 0 : constants.HEIGHT * -1,
        left: 0,
        right: settingsOpen ? graphConstants.SETTINGS_WIDTH : 0,
        height: constants.HEIGHT,
    };
}
export const dimensions = createSelector([isMenuOpen, settingsOpen], getDimensions);
