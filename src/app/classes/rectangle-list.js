import _ from 'underscore';
import * as functions from '../graph/functions';
import Rectangle from './rectangle';

export default class RectangleManager {
    constructor(graph) {
        this.graph = graph;
        this.rects = this.createInitialRectangles();
        this.rectsList = _.flatten(_.values(this.rects));
        //this.computeForces();
    }

    createInitialRectangles() {
        const result = _.mapObject(this.graph.indexedByDepth, (nodes, depth) => {
            return nodes.map((node, i) => {
                const rect = new Rectangle(node);
                rect.setXForIndex(node.x);
                rect.setYForIndex(+depth);  
                return rect;   
            });
        });
        return result;
    }
/*
    sort() {
        this.rects = _.mapObject(this.rects, (rects, depth) => {
            return _.sortBy(rects, d => d.x);
        });
    }

    computeForces() {
        return _.mapObject(this.rects, (rects, depth) => {
            return rects.map((rect, i) => {
                const left = i === 0 ? null : rects[i-1];
                const right = i === rects.length-1 ? null : rects[i+1];
                //console.log(rect, left, right, rect.getForce(left, right));
                const force = rect.getForce(left, right);
                rect.computedForce = force;
            });
        });
    }

    applyForces() {
        return _.mapObject(this.rects, (rects, depth) => {
            return rects.map(rect => rect.applyForce())
        });
    }*/
}