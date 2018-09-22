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
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import CheckIcon from 'material-ui/svg-icons/navigation/check';


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
        width={constants.SETTINGS_WIDTH}
        open={props.open}
        onRequestChange={props.close}
        openSecondary={true}
    >
        <List>
            <Subheader>Selection Type:</Subheader>
            <Divider/>
            {
                constants.FILTER_OPTIONS.map((str) => {
                    return <ListItem
                        primaryText={str}
                        leftIcon={props.filterOption === str ? <CheckIcon /> : null}
                        onClick={() => props.setFilterOption(str)}
                    />
                })
            }
        </List>
    </Drawer>
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.Graph.settingsOpen,
    filterOption: state.Graph.filterOption,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => {
        dispatch({
            type: 'TOGGLE_SETTINGS_OPEN_STATE',
        });
    },
    setFilterOption: (val) => {
        dispatch({
            type: 'SET_FILTER_OPTION',
            option: val,
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);