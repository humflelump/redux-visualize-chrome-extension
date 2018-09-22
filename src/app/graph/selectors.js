import { createSelector } from 'reselect';
import createAsyncSelector from 'async-selector';
import * as d3 from 'd3';
import * as functions from './functions';
import * as constants from './constants';
import * as graphSelectors from './create-graph-selectors';
import _ from 'underscore';

const width = state => state.Window.width;
const height = state => state.Window.height;
const xTo = state => state.Graph.xTo;
const yTo = state => state.Graph.yTo;
const xFrom = state => state.Graph.xFrom;
const yFrom = state => state.Graph.yFrom;
const rectangles = graphSelectors.rectangles;


function getDimensions(width, height) {
    const HEADER = constants.HEADER_SIZE;
    return {
        width: width,
        height: height - HEADER,
        top: HEADER,
        left: 0,
    };
}
export const chartDimensions = createSelector([width, height], getDimensions);

export function getZoomedOutScales(rectangles, chartDimensions) {

    const size = Math.min(chartDimensions.width, chartDimensions.height)
    const padding = size / 20;
    const extent = [padding, size - padding];
    const result = {
        x: [d3.min(rectangles.map(d => d.x)), d3.max(rectangles.map(d => d.x + d.width))],
        y: [d3.min(rectangles.map(d => d.y)), d3.max(rectangles.map(d => d.y + d.height))],
    }
    const size2 = Math.max(result.x[1] - result.x[0], result.y[1] - result.y[0]);
    result.x[1] = result.x[0] + size2;
    result.y[1] = result.y[0] + size2;
    return {
        x: d3.scaleLinear().domain(result.x).range(extent),
        y: d3.scaleLinear().domain(result.y).range(extent),
    }
}
export const extent = createSelector([rectangles, chartDimensions], getZoomedOutScales);


function getXScale(xTo, xFrom) {
    return d3.scaleLinear().domain(xFrom).range(xTo);
}
export const xScale = createSelector([xTo, xFrom], getXScale);

function getYScale(yTo, yFrom) {
    return d3.scaleLinear().domain(yFrom).range(yTo);
}
export const yScale = createSelector([yTo, yFrom], getYScale);

function getIfZoomedOut(extent, xScale, yScale) {
    const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
    if (!eq(extent.x.domain(), xScale.domain())) return false;
    if (!eq(extent.y.domain(), yScale.domain())) return false;
    if (!eq(extent.x.range(), xScale.range())) return false;
    if (!eq(extent.y.range(), yScale.range())) return false;
    return true;
}
export const isZoomedOut = createSelector([extent, xScale, yScale], getIfZoomedOut);

function getZoom(chartDimensions) {
    return callback => d3.zoom()
        .extent([[0, 0], [chartDimensions.width, chartDimensions.height]])
        .on("zoom", callback)
}
export const zoom = createSelector([chartDimensions], getZoom);

function getRectangesInPixelSpace(rectangles, xScale, yScale) {
    const results = rectangles.map((rect) => {
        const x1 = xScale(rect.x);
        const y1 = yScale(rect.y);
        const x2 = xScale(rect.x + rect.width);
        const y2 = yScale(rect.y + rect.height);
        return {
            node: rect.node,
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            scale: (x2 - x1) / rect.width,
        };
    });
    return results;
}

export const pxlRects = createSelector([rectangles, xScale, yScale], getRectangesInPixelSpace);


function getArrows(rectangles) {
    const indexed = _.indexBy(rectangles, d => d.node.id);
    const arrows = [];
    for (const rectangle of rectangles) {
        for (const id of rectangle.node.data.dependencies) {
            const target = indexed[id];
            const start = functions.getArrowStart(rectangle);
            const end = functions.getArrowEnd(target);
            const arrow = {
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                id: rectangle.node.data.id + '>' + target.node.data.id,
            };
            arrows.push(arrow);
        }
    }
    return arrows;
}
export const arrows = createSelector([pxlRects], getArrows);

