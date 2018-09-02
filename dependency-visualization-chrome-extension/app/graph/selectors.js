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
        width: width - 20,
        height: height - HEADER - 10,
        top: HEADER,
        left: 10,
    };
}
export const chartDimensions = createSelector([width, height], getDimensions);

function getXScale(xTo, xFrom) {
    return d3.scaleLinear().domain(xFrom).range(xTo);
}
export const xScale = createSelector([xTo, xFrom], getXScale);

function getYScale(yTo, yFrom) {
    return d3.scaleLinear().domain(yFrom).range(yTo);
}
export const yScale = createSelector([yTo, yFrom], getYScale);

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
            ...rect,
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
    const indexed = _.indexBy(rectangles, d => d.data.id);
    const arrows = [];
    for (const rectangle of rectangles) {
        for (const id of rectangle.data.dependencies) {
            const target = indexed[id];
            const start = functions.getArrowStart(rectangle);
            const end = functions.getArrowEnd(target);
            const arrow = {
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
            };
            arrows.push(arrow);
        }
    }
    return arrows;
}
export const arrows = createSelector([pxlRects], getArrows);

