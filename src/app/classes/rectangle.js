
const WIDTH = 200;
const HEIGHT = 150;
const PADDING = 70;


function repulsion(dx) {
    if (dx <= 2) return 50000; 
    return 1000 / (dx * dx);
}

function angleRepulsion(dTheta) {
    if (dTheta <= 0.05) return 1;
    return 1 / (dTheta * dTheta);
}

function compression(x) {
    if (x >= 0) {
        return 0.5;
    }
    return -0.5;
}

function tension(dx) {
    const sign = dx < 0 ? -1 : 1;
    return sign * Math.sqrt(Math.abs(dx)) / 1000;
}

export default class Rectangle {
    constructor(node) {
        this.node = node;
        this.node.rectangle = this;
        this.x = 0;
        this.y = 0;
        this.width = WIDTH;
        this.height = HEIGHT;
        this.computedForce = null;
    }

    applyForce() {
        const dx = this.computedForce
        const sign = dx > 0 ? 1 : -1;
        this.x += sign * Math.sqrt(Math.min(100,Math.abs(dx) )) / 10;
        
    }

    computeAngle(rect) {
        const dx = rect.x - this.x;
        const dy = rect.y - this.y;
        const theta = Math.atan2(dy, dx);
        return theta;
    }

    setXForIndex(index) {
        this.x = WIDTH * index + PADDING * (index + 1);
    }

    setYForIndex(index) {
        this.y = HEIGHT * index + PADDING * (index + 1);
    }

    getForce(left, right) {
        let force = 0;
        force += this.getRepulsion(left, right);
        force += this.getAngleRepulsion();
        force += this.getCompression();
        force += this.getTension();
        // if (this.computedForce && force * this.computedForce < 0) {
        //     const old = force;
        //     force = this.computedForce;
        //     this.computedForce = old;
        // }
        // if (this.node.id === 'state.Component.text2') {
        //     console.log('total', force);
        //     console.log('angle', this.getAngleRepulsion());
        //     console.log('repulsion', this.getRepulsion(left, right));
        //     console.log('compression', this.getCompression());
        //     console.log('tension', this.getTension());
        // }
        return force;
    }

    getRepulsion(left, right) {
        let force = 0;
        if (left) {
            const dx = this.x - (left.x + left.width);
            force += repulsion(dx);
        }
        if (right) {
            const dx = right.x - (this.x + this.width);
            force -= repulsion(dx);
        }
        return force;
    }

    getAngleRepulsion() {
        let force = 0;
        for (const parent of this.node.parents) {
            const parentAngle = this.computeAngle(parent.rectangle);
            for (const sibling of parent.children) {
                if (sibling !== this.node) {
                    const siblingAngle = sibling.rectangle.computeAngle(parent.rectangle);
                    const dTheta = siblingAngle - parentAngle;
                    if (dTheta <= 0) {
                        force += angleRepulsion(dTheta * -1);
                    } else {
                        force -= angleRepulsion(dTheta);
                    }
                }
            }
        }
        if (this.node.data.id === 'state.Component.text2') {
            //console.log('force angle repulsion', force);
        }
        return force;
    }

    getCompression() {
        return compression(this.x);
    }

    getTension() {
        let force = 0;
        for (const parent of this.node.parents) {
            const parentRect = parent.rectangle;
            const dx = parentRect.x - this.x;
            const dy = parentRect.y - this.y;
            const theta = Math.atan2(dy, dx);
            const cosTheta = Math.cos(theta);
            const L = Math.sqrt(dx * dx + dy * dy);
            force += tension(L * cosTheta);
        }
        return force;
    }
}
