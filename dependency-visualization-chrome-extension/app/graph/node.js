import React from 'react';
import * as d3 from 'd3';
import * as visConstants from './constants';
import * as actions from './actions';
import { connect } from 'react-redux'


function getStyles(rect, highlight) {
    const BORDER = '1px solid rgba(0,0,0,0.2)'
    return {
        container: {
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            position: 'absolute',
            backgroundColor: highlight ? 'rgba(220,220,220,1)' : 'white',
            border: BORDER,
            transition: 'background-color 0.3s',
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
            backgroundColor: visConstants.getColorForType(rect.data.type),
        },
        headerText: {
            fontFamily: '"Roboto", sans-serif',
            fontSize: 12 * rect.scale,
            color: 'black',
            textAlign: 'center',
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
    };
}

function getTypeText(rect) {
    if (rect.data.type !== visConstants.STATE_VARIABLE) {
        return rect.data.type;
    }
    const L = rect.data.pathsToState.length;
    if (L === 1) {
        return rect.data.pathsToState[0];
    } else if (L > 1) {
        return `${L} Places in State`;
    } else {
        return `Not Found in State`;
    }
}

const Node = (props) => {
    const {rect, highlight} = props;
    const styles = getStyles(rect, highlight);
    return (<div 
        style={styles.container} 
        onMouseEnter={() => props.setHovered(rect.data.id)}
        onMouseLeave={() => props.setHovered(null)}
        onClick={() => actions.clickNode(rect.data.id)}
    >
        <div style={styles.header}>
            <div style={styles.headerText}>{rect.data.name}</div>
        </div>
        <div style={styles.typeArea}>
            <div style={styles.typeText}>{getTypeText(rect)}</div>
        </div>
        <div style={styles.valueHeader}>Current Value:</div>
        <div style={styles.valueContainer} onClick={() => console.log(rect.data.value)}>
            <div style={styles.valueText}>{rect.data.stringifiedResult.slice(0, 80)}</div>
        </div>
    </div>)
}

const mapDispatch = (dispatch) => {
    return {
        setHovered: (id) => {
            dispatch({
                type: 'SET_HOVERED_NODE',
                node: id,
            });
        },
        setClicked: (id) => {
            dispatch({
                type: 'SET_CLICKED_NODE',
                node: id,
            });
        },
    }
}

export default connect(null, mapDispatch)(Node);