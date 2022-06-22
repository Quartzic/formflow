import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE,} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import submissionsSlice from "./submissionsSlice";
import undoable from "redux-undo";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import barcodesSlice from "./barcodesSlice";
import workflowSlice from "./workflowSlice";
import metadataSlice from "./metadataSlice";
import * as Sentry from "@sentry/react";
import posthogMiddleware from "./posthogMiddleware";

// ...

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
    actionTransformer: action => {
        return {
            type: action.type
        };
    },
    stateTransformer: state => {
        
        // Transform the state to remove sensitive information
        return {
            ...state,
            submissions: null,
            barcodes: null
        };

    },
});

export const reducers = undoable(combineReducers({
    submissions: submissionsSlice.reducer,
    barcodes: barcodesSlice.reducer,
    workflow: workflowSlice.reducer,
    metadata: metadataSlice.reducer,

}));

const persistedRootReducer = persistReducer({
    key: 'root',
    storage,
    stateReconciler: hardSet,
}, reducers);

export const store = configureStore({
    reducer: persistedRootReducer,
    // middleware: [loggerMiddleware],
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(posthogMiddleware),
    enhancers: [sentryReduxEnhancer]
})