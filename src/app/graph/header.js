import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphSelectors from './create-graph-selectors';
import * as d3 from 'd3';
import * as actions from './actions';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Search from '../search/container';

import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';

function getStyles(chartDimensions) {
    return {
        container: {
            top: 0,
            left: 0,
            right: 0,
            height: constants.HEADER_SIZE,
            position: 'absolute',
            backgroundColor: 'rgb(86, 0, 147)',
            display: 'flex',
            borderRadius: 0,
        },
        settingsContainer: {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: constants.HEADER_SIZE,
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
        },
        flex: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-around',
        },
    };
}

const Header = (props) => {
    const styles = getStyles();
    return <Paper zDepth={3} style={styles.container}>
        <Search />
        <div style={styles.settingsContainer}>
            <IconButton onClick={props.openSettings} tooltip="Settings">
                <ActionSettings color="white"/>
            </IconButton>
        </div>
        <div style={styles.flex}>
            <FlatButton
                label="Show Everything" 
                onClick={props.resetClickedNodes}
                disabled={props.clickedNodes.size === 0}
            />
        </div>
        <div style={styles.flex}>
            <FlatButton
                label="Reset Zoom" 
                onClick={actions.resetZoom}
                disabled={props.isZoomedOut}
            />
        </div>
    </Paper>
}

const mapStateToProps = (state, ownProps) => {
  return {
    filterOption: state.Graph.filterOption,
    clickedNodes: state.Graph.clickedNodes,
    isZoomedOut: selectors.isZoomedOut(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterOption: (val) => {
        dispatch({
            type: 'SET_FILTER_OPTION',
            option: val,
        });
    },
    resetClickedNodes: () => {
        dispatch({
            type: 'RESET_CLICKED_NODES',
        });
    },
    openSettings: () => {
        dispatch({
            type: 'TOGGLE_SETTINGS_OPEN_STATE',
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);