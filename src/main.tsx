import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { store } from "./app/store.ts"
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'

let theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      }
    },
    MuiInput: {
      defaultProps: {
        sx: {
          fontSize: "10px",
        }
      }
    },
    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: "13px",
          top: 2,
        },
      },
      styleOverrides: {
        shrink: ({ ownerState }) => ({
          ...(ownerState.shrink && {
            fontSize: "1rem !important",
            top: "-1 !important",
          }),
        }),
      },
    },
  },
  palette: {
    primary: {
      main: '#0b3c5d',
    },
    secondary: {
      main: '#f8f1f1',
    },
  },
})

theme = responsiveFontSizes(theme);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </LocalizationProvider>
      </ BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
