import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { persistor, store } from './app/store';
import LinearProgress from '@mui/material/LinearProgress';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from './utils/theme';
import { ToastProvider } from './context/ToastContext';
import { PersistGate } from 'redux-persist/integration/react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { PrintProvider } from './context/PrintPDFContext';
import en from 'date-fns/locale/en-IN';
import { PdfViewerProvider } from './context/PdfViewerContext';
import ErrorBoundary from './components/Utils/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
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
  </React.StrictMode>,
);
