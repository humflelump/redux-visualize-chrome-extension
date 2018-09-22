import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as constants from './constants';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function getStyles(dimensions) {
    const HEADER = 32;
    return {
        container: {
            ...dimensions,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 2,
            transition: 'all 0.3s'

        },
        header: {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            height: HEADER,
            borderBottom: '1px solid rgb(209, 209, 209)',
        },
        headerText: {
            fontSize: 20,
            fontFamily: '"Roboto", sans-serif',
            color: 'rgb(84, 84, 84)',
            textAlign: 'left',
            margin: 5,
        },
        dataArea: {
            position: 'absolute',
            left: 0,
            right: '50%',
            top: HEADER,
            bottom: 0,
            borderRight: '1px solid rgb(209, 209, 209)',
            overflow: 'auto',
        },
        listArea: {
            position: 'absolute',
            right: 0,
            left: '50%',
            top: HEADER,
            bottom: 0,
            overflow: 'auto',
        },
        jsonString: {
            fontSize: 10,
            marginLeft: 5,
            cursor: 'pointer',
        },
    };
}

const ContextMenu = (props) => {
    const styles = getStyles(props.dimensions);
    const d = (props.selectedNode || {}).data || {};
    return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Paper zDepth={3} id="context" style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerText}>{d.name}</div>
            </div>
            <div style={styles.dataArea}>
                <pre style={styles.jsonString}>
                    {d.stringifiedResult || ''}
                </pre>
            </div>
            <div style={styles.listArea}>
                <List>
                    {
                        constants.FILTER_OPTIONS.map((str) => {
                            const selected = props.filterType === str;
                            return <ListItem 
                                primaryText={str}
                                onClick={() => props.setFilter(str)}
                                rightIcon={selected ? <CheckIcon color="green"/> : null}
                            />
                        })
                    }
                </List>
            </div>
        </Paper>
    </MuiThemeProvider>
}

const mapStateToProps = (state, ownProps) => {
  return {
    dimensions: selectors.dimensions(state),
    selectedNode: selectors.selectedNode(state),
    filterType: state.ContextMenu.filterType,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilter: (filter) => {
        dispatch({
            type: 'SET_FILTER_TYPE',
            filter: filter,
        });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextMenu);