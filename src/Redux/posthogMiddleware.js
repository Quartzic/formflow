import posthog from 'posthog-js';

const posthogMiddleware = storeAPI => next => action => {
    posthog.capture("Redux event dispatched", {type: action.type});
    next(action)
}

export default posthogMiddleware;