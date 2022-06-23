import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import "./index.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import NiceModal from "@ebay/nice-modal-react";
import {store} from "./Redux/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
import {Offline as OfflineIntegration} from "@sentry/integrations"
import posthog from "posthog-js";

const version = require('../package.json').version

Sentry.init({
    dsn: "https://46f242cb9fc74758a84711173f79f087@o201925.ingest.sentry.io/6521070",
    integrations: [new BrowserTracing(), new OfflineIntegration({
      maxStoredEvents: 30
    }), new posthog.SentryIntegration(posthog, 'quartzic', 6521070)],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "development" : "production",
    release: `formflow@${version}`,
    normalizeDepth: 10,
    beforeSend(event) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception) {
            Sentry.showReportDialog({ eventId: event.event_id });
        }
        return event;
    },
});


TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root"));
const persistor = persistStore(store);

root.render(
    <React.StrictMode>
        <NiceModal.Provider>
            <BrowserRouter>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <App/>
                    </PersistGate>
                </Provider>
            </BrowserRouter>
        </NiceModal.Provider>
    </React.StrictMode>
);
