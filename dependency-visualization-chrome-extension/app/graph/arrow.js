import React from 'react';
import * as d3 from 'd3';
import * as visConstants from './constants';


function getStyles(arrow) {
    return {
        line: {
            stroke: 'rgb(255,0,0)',
            strokeWidth: 2,
        },
    };
}

const Arrow = ({arrow}) => {
    const styles = getStyles(arrow);
    return (<line 
        style={styles.line}
        x1={arrow.x1}
        x2={arrow.x2}
        y1={arrow.y1}
        y2={arrow.y2}
    />)
}

export default Arrow;