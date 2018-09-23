import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphConstants from '../graph/constants';
import * as d3 from 'd3';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

function getStyles(chartDimensions) {
    return {
        container: {

        },
    };
}

const Settings = (props) => {
    const styles = getStyles();
    return <Drawer
        docked={false}
        width={graphConstants.SETTINGS_WIDTH}
        open={props.open}
        onRequestChange={props.close}
        openSecondary={true}
    >
        <List>
            <Subheader>Hightlight When Hovering:</Subheader>
            {
                constants.FILTER_OPTIONS.map((str) => {
                    return <ListItem 
                        primaryText={str}
                        key={str}
                        onClick={() => props.setHoverOption(str)}
                        leftIcon={props.hoverOption === str ? <CheckIcon color="green" /> : null}
                    />
                })
            }
            <Subheader>Max Nodes on Screen:</Subheader>
            <DropDownMenu 
                value={props.maxNodesOnScreen} 
                onChange={(e, key, num) => props.setMaxNodes(num)}
            >
            {
                constants.MAX_NODES_OPTIONS.map((n) => {
                    return <MenuItem value={n} primaryText={n} key={n} />
                })
            }
            </DropDownMenu>
        </List>
    </Drawer>
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.Graph.settingsOpen,
    hoverOption: state.Settings.hoverOption,
    maxNodesOnScreen: state.Settings.maxNodesOnScreen,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setMaxNodes: (n) => {
        dispatch({
            type: 'SET_MAX_NODES_ON_SCREEN',
            count: n,
        });
    },
    setHoverOption: (option) => {
        dispatch({
            type: 'SET_HOVER_OPTION',
            option,
        });
    },
    close: () => {
        dispatch({
            type: 'TOGGLE_SETTINGS_OPEN_STATE',
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);