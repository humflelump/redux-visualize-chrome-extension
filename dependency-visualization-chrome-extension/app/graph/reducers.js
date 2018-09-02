import * as constants from './constants';

const initialState = {
    graph: [],
    hoveredNode: null,
    clickedNodes: new Set(),
    filterOption: constants.DEPENDANCIES,
    xTo: [0, 500],
    xFrom: [0, 500],
    yTo: [0, 500],
    yFrom: [0, 500],

};
const Graph = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GRAPH':
            return { ...state, graph: action.graph};
        case 'SET_HOVERED_NODE':
            return { ...state, hoveredNode: action.node };
        case 'SET_CLICKED_NODES':
            return { ...state, clickedNodes: action.nodes };
        case 'RESET_CLICKED_NODES':
            return { ...state, clickedNodes: initialState.clickedNodes };
        case 'SET_FILTER_OPTION':
            return { ...state, filterOption: action.option}
        case 'SET_SCALES':
            return { 
                ...state,
                xTo: action.x.range(),
                xFrom: action.x.domain(),
                yTo: action.y.range(),
                yFrom: action.y.domain(),
            };
        default:
            return state
    }
};


export default Graph;