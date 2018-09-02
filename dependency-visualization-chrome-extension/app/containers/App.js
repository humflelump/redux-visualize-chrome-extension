import React from 'react';
import { connect } from 'react-redux';
import Graph from '../graph/container';

class App extends React.Component {

  render() {
    return (
      <div>
        <Graph />
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