import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
  Routes,
} from "react-router-dom";
import { persistor, store } from "./app/store";
import LinearProgress from "@mui/material/LinearProgress";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./utils/theme";
import { ToastProvider } from "./context/ToastContext";
import { PersistGate } from "redux-persist/integration/react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { PrintProvider } from "./context/PrintPDFContext";
import en from "date-fns/locale/en-IN";
import { PdfViewerProvider } from "./context/PdfViewerContext";
import { ErrorBoundary } from "@sentry/react";
import { ErrorBoundaryFallback } from "./components/Utils/ErrorBoundaryFallback";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://4a6e5100d4e0374e9140bbfb841948c2@o4507926497656832.ingest.de.sentry.io/4507926638624848",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/dashboard\.evarahealth\.in/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

export const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={ErrorBoundaryFallback}>
      <Provider store={store}>
        <PersistGate loading={<LinearProgress />} persistor={persistor}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={en}
              >
                <ToastProvider>
                  <PrintProvider>
                    <PdfViewerProvider>
                      <App />
                    </PdfViewerProvider>
                  </PrintProvider>
                </ToastProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
