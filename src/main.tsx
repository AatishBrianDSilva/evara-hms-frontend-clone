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
      main: '#F1168D', // Primary brand color
      light: '#F673BA',
      contrastText: '#fff', // Assuming white contrast text for primary color
    },
    secondary: {
      main: '#248C88', // Secondary brand color
      light: '#65AEAB',
      contrastText: '#fff', // Assuming white contrast text for secondary color
    },
    error: {
      main: '#CE2F0C', // Error state color
    },
    warning: {
      main: '#F98D0E', // Warning state color
    },
    info: {
      main: '#166BF4', // Info state color
    },
    success: {
      main: '#44C431', // Success state color
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
