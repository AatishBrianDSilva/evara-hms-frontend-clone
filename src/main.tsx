import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./index.css"
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { persistor, store } from "./app/store"
import LinearProgress from '@mui/material/LinearProgress';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from './utils/theme'
import { ToastProvider } from './context/ToastContext'
import { PersistGate } from 'redux-persist/integration/react'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LinearProgress />} persistor={persistor}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <ToastProvider>
                <App />
              </ToastProvider>
            </ThemeProvider>
          </LocalizationProvider>
        </ BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
