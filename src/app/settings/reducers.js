import * as constants from './constants';

const initialState = {
    settingsOpen: false,
    hoverOption: constants.DEPENDANCIES,
    maxNodesOnScreen: 100,
};
const Settings = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MAX_NODES_ON_SCREEN':
            return { ...state, maxNodesOnScreen: action.count }
        case 'SET_HOVER_OPTION':
            return { ...state, hoverOption: action.option };
        case 'TOGGLE_SETTINGS_OPEN_STATE':
            return { ...state, settingsOpen: !state.settingsOpen };
        default:
            return state
    }
};


export default Settings;