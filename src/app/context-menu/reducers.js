import * as constants from './constants';

const initialState = {
    selectedNodeId: null,
    filterType: constants.NO_FILTER,
};
const ContextMenu = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SELECTED_NODE':
            return { ...state, selectedNodeId: action.node};
        case 'SET_FILTER_TYPE':
            return { ...state, filterType: action.filter };
        default:
            return state
    }
};


export default ContextMenu;