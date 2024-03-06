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
import { ToastProvider } from './context/ToastContext.tsx'

const fontSize = "13px"

let theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto Flex',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "35px",
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          height: "35px",
          fontSize: fontSize,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: fontSize,
        }
      }
    },
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: "13px",
          color: "text.secondary",
        },
      },
      styleOverrides: {
        shrink: ({ ownerState }) => ({
          ...(ownerState.shrink && {
            fontSize: "15px !important",
            top: "-1 !important",
          }),
        }),
      },
    }
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
    }
  },
})

theme = responsiveFontSizes(theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </ BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
