import posthog from 'posthog-js';

const posthogMiddleware = storeAPI => next => action => {
    // disable middleware when running unit tests
    if(process.env.NODE_ENV !== 'test') {
        posthog.capture("Redux event dispatched", {type: action.type});
        next(action)
    }
}

export default posthogMiddleware;