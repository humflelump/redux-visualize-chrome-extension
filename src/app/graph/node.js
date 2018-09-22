import React from 'react';
import * as d3 from 'd3';
import * as visConstants from './constants';
import * as actions from './actions';
import * as constants from './constants';
import { connect } from 'react-redux'


function getStyles(rect, highlight, animated) {
    const BORDER = '1px solid rgba(0,0,0,0.2)'
    const t = constants.TRANSITION_MS / 1000;
    return {
        container: {
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            position: 'absolute',
            backgroundColor: highlight ? 'rgba(220,220,220,1)' : 'white',
            border: BORDER,
            transition: animated ? `all linear ${t}s` : `background-color linear ${t}s`,
            transitionTimingFunction: 'linear',
            borderRadius: 5 * rect.scale,
            overflow: 'hidden',
            //boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        },
        header: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: rect.width,
            height: '20%',
            borderBottom: BORDER,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            backgroundColor: visConstants.getColorForType(rect.node.data.type),
        },
        headerText: {
            fontFamily: '"Roboto", sans-serif',
            fontSize: 15 * rect.scale,
            color: 'black',
            textAlign: 'center',
            marginTop: '1%',
        },
        typeArea: {
            position: 'absolute',
            left: 0,
            top: '20%',
            right: 0,
            height: '20%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            borderBottom: BORDER,
        },
        typeText: {
            fontFamily: '"Roboto", sans-serif',
            fontSize: Math.min(10 * rect.scale, 20),
            color: 'black',
            textAlign: 'center',
        },
        valueHeader: {
            position: 'absolute',
            top: '40%',
            left: 0,
            right: 0,
            height: '10%',
            textAlign: 'center',
            fontFamily: '"Roboto", sans-serif',
            fontSize: 8 * rect.scale,
            color: 'gray',
            textAlign: 'center'
        },
        valueContainer: {
            position: 'absolute',
            left: 0,
            top: '50%',
            right: 0,
            bottom: 0,
            padding: 5 * rect.scale,
            whiteSpace: 'wrap',
            wordWrap: 'break-word',
            cursor: 'pointer',
        },
        valueText: {
            fontFamily: '"Roboto", sans-serif',
            fontSize: 7 * rect.scale,
            color: 'black',

        },
        body: {
            position: 'absolute',
            top: '20%',
            left: 0,
            right: 0,
            bottom: 0,
            fontSize: 9 * rect.scale,
            paddingLeft: 5 * rect.scale,
            paddingTop: -5 * rect.scale,
        },
    };
}

function getTypeText(rect) {
    return rect.data.type;
    
}

const Node = (props) => {
    const {rect, highlight} = props;
    const styles = getStyles(rect, highlight, props.animations);
    return (<div 
        style={styles.container} 
        onContextMenu={(e) => {
            e.preventDefault();
            props.setMenu(rect);
        }}
        onMouseEnter={() => props.setHovered(rect.node.data.id)}
        onMouseLeave={() => props.setHovered(null)}
        onClick={() => props.setClicked(rect.node.id)}
    >
        <div style={styles.header}>
            <div style={styles.headerText}>{rect.node.data.name}</div>
        </div>
        <div style={styles.body}>
            <pre>
                {rect.scale > 0.5 ? (rect.node.data.stringifiedResult || '') : ''}
            </pre>
        </div>
    </div>)
}

const mapDispatch = (dispatch) => {
    return {
        setMenu: (node) => {
            dispatch({
                type: 'SET_NODE_WITH_MENU',
                node,
            });
        },
        setHovered: (id) => {
            dispatch({
                type: 'SET_HOVERED_NODE',
                node: id,
            });
        },
        setClicked: (node) => {
            dispatch({
                type: 'SET_SELECTED_NODE',
                node,
            });
        },
    }
}

const mapState = (state) => {
    return {
        animations: state.Graph.animations,
    }
}

export default connect(mapState, mapDispatch)(Node);
