
import * as graphSelectors from './create-graph-selectors';
import * as functions from './functions';
import * as constants from './constants';
import * as selectors from './selectors';

const state = () => window.store.getState();


function getClickedDependencies(rootNodes, clickedNode) {
    if (clickedNode === null) return new Set();
    return functions.getDependencies(rootNodes, clickedNode);
}

function getClickedDependants(rootNodes, clickedNode) {
    if (clickedNode === null) return new Set();
    return functions.getDependants(rootNodes, clickedNode);
}

function getClickedNodes(filterOption, clickedDependants, clickedDependencies) {
    switch (filterOption) {
        case constants.DEPENDANCIES:
            return clickedDependencies;
        case constants.DEPENDANTS:
            return clickedDependants;
        case constants.BOTH:
            return new Set([...clickedDependants, ...clickedDependencies]);
        case constants.NEITHER:
            return new Set();
        default:
            return new Set();
    }
}

export function withAnimation(f) {
    window.store.dispatch({type: 'TOGGLE_ANIMATIONS'});
    f();
    setTimeout(() => {
        window.store.dispatch({type: 'TOGGLE_ANIMATIONS'});
    }, constants.TRANSITION_MS); 
}

export function clickNode(id) {
    const rootNodes = graphSelectors.rootNodes(state());
    const filterOption = state().Graph.filterOption;
    const clickedDependants = getClickedDependants(rootNodes, id);
    const clickedDependencies = getClickedDependencies(rootNodes, id);
    const nodes = getClickedNodes(filterOption, clickedDependants, clickedDependencies);
    withAnimation(
        () => window.store.dispatch({
            type: 'SET_CLICKED_NODES',
            nodes: nodes,
        })
    );
}

export function resetZoom() {
    const extent = selectors.extent(state());
    withAnimation(
        () => window.store.dispatch({
            type: 'SET_SCALES',
            x: extent.x,
            y: extent.y,
        })
    );
}

export function zoomToNode(id) {
    const rootNodes = graphSelectors.rootNodes(state());
    const filterOption = state().Graph.filterOption;
    const clickedDependants = getClickedDependants(rootNodes, id);
    const clickedDependencies = getClickedDependencies(rootNodes, id);
    const nodes = getClickedNodes(filterOption, clickedDependants, clickedDependencies);

    const chartDimensions = selectors.chartDimensions(state());
    const rectangles = graphSelectors.rectangles(state());
    const filtered = rectangles.filter(rect => nodes.has(rect.data.id));

    const extent = selectors.getZoomedOutScales(filtered, chartDimensions);
    withAnimation(
        () => window.store.dispatch({
            type: 'SET_SCALES',
            x: extent.x,
            y: extent.y,
        })
    );
}