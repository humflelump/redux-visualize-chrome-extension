import React from 'react';
import { connect } from 'react-redux'
import * as selectors from './selectors';
import * as graphSelectors from './create-graph-selectors';
import * as filterSelectors from './node-filter-selectors';
import * as d3 from 'd3';
import Node from './node';
import Arrow from './arrow';
import Header from './header';

function getStyles(chartDimensions) {
    return {
        container: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
        },
        divContainer: {
            ...chartDimensions,
            position: 'relative',
            zIndex: 1,
            border: '1px solid black',
            overflow: 'hidden',
        },
        svgContainer: {
            ...chartDimensions,
            position: 'absolute',
            zIndex: 0,
            pointerEvents: 'none',
        },
    };
}

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            props,
        };
        this.dom = {};
    }

    componentDidMount() {
        this.data.props = this.props;
        update(this.data, this.dom);
    }

    componentDidUpdate() {
        this.data.props = this.props;
        update(this.data, this.dom);
    }

    render() {
        const styles = getStyles(this.props.chartDimensions);

        return <div id="Graph" style={styles.container} >
            <Header />
            <div style={styles.divContainer}>
            {
                this.props.pxlRects.map((rect) => {
                    return (<Node 
                        rect={rect} 
                        highlight={this.props.highlightedNodes.has(rect.data.id)}
                    />)
                })
            }
            </div>
            <svg style={styles.svgContainer}>
            {
                this.props.arrows.map((arrow) => {
                    return (<Arrow arrow={arrow} />)
                })
            }
            </svg>
        </div>
    }
}

function update(data, dom) {
    const container = d3.select('#Graph');

    const zoom = data.props.zoom(zoomed);

    function zoomed() {
        if (data.stopRecursion) {
            data.stopRecursion = false;
            return;
        }

        const newXScale = d3.event.transform.rescaleX(data.props.xScale);
        const newYScale = d3.event.transform.rescaleY(data.props.yScale);
    
        data.props.setScales(newXScale, newYScale);
        data.stopRecursion = true;
        container.call(zoom.transform, d3.zoomIdentity);
    }

    container.call(zoom);
}

const mapStateToProps = (state, ownProps) => {
  return {
    chartDimensions: selectors.chartDimensions(state),
    pxlRects: selectors.pxlRects(state),
    zoom: selectors.zoom(state),
    xScale: selectors.xScale(state),
    yScale: selectors.yScale(state),
    rootNodes: graphSelectors.rootNodes(state),
    arrows: selectors.arrows(state),
    flatGraph: graphSelectors.flatGraph(state),
    nodesWithCoordinates: graphSelectors.nodesWithCoordinates(state),
    highlightedNodes: graphSelectors.highlightedNodes(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScales: (x, y) => {
        dispatch({
            type: 'SET_SCALES',
            x: x,
            y: y,
        });
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graph);