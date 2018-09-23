
import * as graphSelectors from './create-graph-selectors';
import * as functions from './functions';
import * as constants from './constants';
import * as selectors from './selectors';

const state = () => window.store.getState();


export function withAnimation(f) {
    window.store.dispatch({type: 'TOGGLE_ANIMATIONS'});
    f();
    setTimeout(() => {
        window.store.dispatch({type: 'TOGGLE_ANIMATIONS'});
    }, constants.TRANSITION_MS); 
}

export function resetZoom() {
    const extent = selectors.extent(state());
    withAnimation(
        () => window.store.dispatch({
            type: 'SET_SCALES',
            x: extent.x,
            y: extent.y,
        })
    );
}