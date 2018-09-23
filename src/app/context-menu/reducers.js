import * as constants from './constants';

const initialState = {
    selectedNodeId: null,
    nodeToFilterOn: null,
    filterType: constants.NO_FILTER,
};
const ContextMenu = (state = initialState, action) => {
    switch (action.type) {
        case 'REMOVE_NODE_TO_FILTER_ON':
            return {
                ...state,
                nodeToFilterOn: null,
            };
        case 'SET_NODE_TO_FILTER_ON':
            return {
                ...state, 
                nodeToFilterOn: action.node,
                filterType: action.filter,
            };
        case 'SET_SELECTED_NODE':
            return { ...state, selectedNodeId: action.node};
        default:
            return state
    }
};


export default ContextMenu;