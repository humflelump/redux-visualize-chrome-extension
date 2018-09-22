
export const WIDTH = 150;
export const HEIGHT = 100;
export const PADDING = 50;

export const STRING = 'string';

export const RESELECT_SELECTOR = 'RESELECT_SELECTOR';
export const ASYNC_SELECTOR = 'ASYNC_SELECTOR';
export const CONNECT = 'CONNECT';
export const STATE_VARIABLE = 'STATE_VARIABLE';
export const UNKNOWN = 'UNKNOWN';
export const SELECTOR = 'SELECTOR';

export const DEFAULT_NAME = 'Anonymous';

export const FUNC_KEY = '__VIS_ID__';
export const FUNC_TYPE = '__VIS_TYPE__';

export function getColorForType(type) {
    switch(type) {
        case STATE_VARIABLE:
            return 'rgb(175, 206, 255)';
        case RESELECT_SELECTOR:
            return 'rgb(175, 255, 197)';
        case ASYNC_SELECTOR:
            return 'rgb(135, 196, 152)';
        case CONNECT:
            return 'rgb(178, 163, 255)';
        default:
            return 'gray';
    }
}

export const HEADER_SIZE = 50;

export const DEPENDANTS = 'Dependents';
export const DEPENDANCIES = 'Dependencies';
export const BOTH = 'Both';
export const NEITHER = 'Neither';
export const FILTER_OPTIONS = [DEPENDANCIES, DEPENDANTS, BOTH, /*NEITHER*/];

export const TRANSITION_MS = 200;

export const SETTINGS_WIDTH = 300;
