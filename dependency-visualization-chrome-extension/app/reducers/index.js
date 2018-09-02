import { combineReducers } from 'redux';
import Graph from '../graph/reducers';
import Window from '../window/reducers';

export default combineReducers({
  Graph,
  Window,
});
