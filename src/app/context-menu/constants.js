import UpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import BothIcon from 'material-ui/svg-icons/action/swap-vert';


export const HEIGHT = 200;
export const FILTER_POPUP_HEIGHT = 20;

export const NO_FILTER = 'No Filters';
export const DEPENDENTS_FILTER = 'Dependents';
export const DEPENDENCIES_FILTER = 'Dependencies';
export const BOTH_FILTER = 'Dependencies and Dependents';
export const BUTTON_ICONS = {
    [DEPENDENTS_FILTER]: UpIcon,
    [DEPENDENCIES_FILTER]: DownIcon,
    [BOTH_FILTER]: BothIcon,
}
export const FILTER_OPTIONS = [DEPENDENCIES_FILTER, DEPENDENTS_FILTER, BOTH_FILTER];