const loggerMiddleware = storeAPI => next => action => {
    console.log('dispatching', action)
    next(action)
}

export default loggerMiddleware;