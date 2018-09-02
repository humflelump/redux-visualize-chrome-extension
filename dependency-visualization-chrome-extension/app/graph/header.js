import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import * as graphSelectors from './create-graph-selectors';
import * as filterSelectors from './node-filter-selectors';
import * as d3 from 'd3';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

function getStyles(chartDimensions) {
    return {
        container: {
            top: 0,
            left: 0,
            right: 0,
            height: constants.HEADER_SIZE,
            position: 'absolute',
            backgroundColor: 'red',
            display: 'flex',
        },
    };
}

const Header = (props) => {
    const styles = getStyles();
    return <div style={styles.container}>
        <DropDownMenu 
            value={props.filterOption} 
            onChange={(e, key, val) => props.setFilterOption(val)}
        >
        {
            constants.FILTER_OPTIONS.map((str) => {
                return <MenuItem 
                    key={str}
                    value={str} 
                    primaryText={str}
                />
            })
        }
        </DropDownMenu>
        <RaisedButton 
            label="Default" 
            onClick={props.resetClickedNodes}
        />
    </div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    filterOption: state.Graph.filterOption,
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);