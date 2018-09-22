import React from 'react';
import { connect } from 'react-redux';
import Graph from '../graph/container';
import Settings from '../graph/settings';
import ContextMenu from '../context-menu/container';

class App extends React.Component {

  render() {
    return (
      <div>
        <Graph />
        <Settings />
        <ContextMenu />
      </div>
    );
  }
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {};
}

export default connect(mapState, mapDispatch)(App);