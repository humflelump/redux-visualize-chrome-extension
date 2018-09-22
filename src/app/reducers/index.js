import { combineReducers } from 'redux';
import Graph from '../graph/reducers';
import Window from '../window/reducers';
import Search from '../search/reducers';
import ContextMenu from '../context-menu/reducers';

export default combineReducers({
  Graph,
  Window,
  Search,
  ContextMenu,
});
