import { createTheme, responsiveFontSizes } from "@mui/material";

const fontSize = "13px";

let theme = createTheme({
  typography: {
    fontFamily: ["Roboto Flex", "sans-serif"].join(","),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    // MuiInputBase: {
    //   styleOverrides: {
    //     root: {
    //       height: "35px",
    //     }
    //   }
    // },
    MuiFormControl: {
      styleOverrides: {
        root: {
          // height: "35px",
          fontSize: fontSize,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: fontSize,
        },
      },
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
    },
  },
  palette: {
    primary: {
      main: "#FF5C00", // Primary brand color
      light: "#FF8442",
      dark: "#C75000",
    },
    secondary: {
      main: "#5981DE", // Secondary brand color
      light: "#84A2FF",
      dark: "#3C5FA0",
    },
    error: {
      main: "#FF3F46", // Error state color
    },
    warning: {
      main: "#FF9321", // Warning state color
    },
    info: {
      main: "#288BDB", // Info state color
    },
    success: {
      main: "#3FC138", // Success state color
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
