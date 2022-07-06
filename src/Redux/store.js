import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE,} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import submissionsSlice from "./submissionsSlice";
import workflowSlice from "./workflowSlice";
import metadataSlice from "./metadataSlice";
import * as Sentry from "@sentry/react";
import posthogMiddleware from "./posthogMiddleware";
import databaseQueueSlice from "./databaseQueueSlice";
import settingsSlice from "./settingsSlice";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
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
        };

    },
});

export const reducers = combineReducers({
    submissions: submissionsSlice.reducer,
    workflow: workflowSlice.reducer,
    metadata: metadataSlice.reducer,
    databaseQueue: databaseQueueSlice.reducer,
    settings: settingsSlice.reducer
});

const persistedRootReducer = persistReducer({
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel1,
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