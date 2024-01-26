import "@fontsource/jost/400.css";
import {
  createTheme,
  Palette,
  Theme as ITheme,
  ThemeOptions,
} from "@mui/material";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { alpha } from "@mui/material/styles";
import { TypeText } from "@mui/material/styles/createPalette";
interface ITypeText extends TypeText {
  tertiary: string;
  accent: string;
  success: string;
  info: string;
  error: string;
}
interface IPalette extends Palette {
  text: ITypeText;
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
    container: string;
  };
  other: {
    background: string;
    component: string;
    success: string;
    error: string;
    info: string;
    accent: string;
    tooltip: string;
  };
}
export interface Theme extends ITheme {
  palette: IPalette;
}
export interface IThemeOptions extends ThemeOptions {
  palette: IPalette;
}
// Create a theme instance.
// When the value for a theme option is dependent on another theme option,
// the theme should be composed in steps.
let theme = createTheme({
  palette: {
    text: {
      primary: "#FFFFFF",
      secondary: alpha("#FFFFFF", 0.6),
      tertiary: alpha("#FFFFFF", 0.4),
      disabled: alpha("#FFFFFF", 0.16),
      accent: "#A77DFF",
      success: "#69F177",
      error: "#FF4343",
      info: "#43A5FF",
    },
    action: {
      hover: "#371A73",
      disabled: alpha("#7844E6", 0.05),
    },
    primary: {
      main: "#7844E6",
      container: alpha("#7844E6", 0.2),
      light: "#a77dff",
    },
    secondary: {
      main: "#19857B",
    },
    error: {
      main: "#FF4343",
    },
    success: {
      main: "#69F177",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
    info: {
      main: "#43A5FF",
    },
    warning: {
      main: "#fef35c",
    },
    background: {
      paper: "linear-gradient(180deg, #130517 0%, #170514 100%)",
    },
    other: {
      background: "linear-gradient(180deg, #130517 0%, #170514 100%);",
      component: alpha("#FFFFFF", 0.2),
      success: "#69F177",
      error: "#FF4343",
      info: "#43A5FF",
      accent: "#a77dff",
      tooltip: "#342a3c",
    },
  },
  typography: {
    fontFamily: ["Jost", "sans-serif"].join(","),
    button: {
      textTransform: "none",
      fontSize: "1.25rem",
    },
    allVariants: {
      letterSpacing: "0.5px",
    },
    body1: {
      fontSize: "1.25rem",
    },
    body2: {
      fontSize: "1rem",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1720,
    },
  },
} as IThemeOptions);

theme = createTheme(theme, {
  palette: {
    text: {
      success: theme.palette.success.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
    },
    primary: {
      container: alpha(theme.palette.primary.main, 0.2),
    },
    background: {
      //default: alpha(theme.palette.primary.main, 0.1),
      default: "#0C030E",
      component: alpha(theme.palette.common.white, 0.2),
    },
    action: {
      disabled: alpha(theme.palette.primary.main, 0.05),
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg, #130517 0%, #170514 100%)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          display: "none",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: "body1",
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          width: "fit-content",
          height: "40px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          "&.Mui-disabled": {
            color: alpha(theme.palette.text.secondary, 0.16),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        fullWidth: {
          width: "100%",
        },
        root: {
          boxShadow: "none",
          borderRadius: 0,
          textTransform: "capitalize",
          "&:hover": {
            boxShadow: "none",
          },
          minHeight: "3.5rem",
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabled,
            color: theme.palette.text.disabled,
          },
        },
        containedPrimary: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        containedError: {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
        },
        containedSecondary: {
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          border: "2px solid #6D3ED1",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.action.hover,
          },
        },
        outlined: {
          color: theme.palette.text.primary,
          border: `2px solid ${theme.palette.primary.main}`,
          borderWidth: "2px",
          backgroundColor: "transparent",
          minWidth: "0px",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            border: `2px solid ${theme.palette.action.hover}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "#0C030E",
          borderWidth: 1,
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#0C030E",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: theme.palette.common.white,
          padding: theme.spacing(0.5, 1),
          backgroundColor: "rgba(120, 68, 230, 0.1)",
          [`.${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: 2,
            borderColor: alpha(theme.palette.common.white, 0.2),
          },
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: 2,
            borderColor: alpha(theme.palette.common.white, 0.2),
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          border: "2px solid rgba(255, 255, 255, 0.2)",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "inherit",
          height: theme.spacing(0.2),
        },
        dashed: {
          backgroundColor: "transparent",
          backgroundImage: "none",
        },
        bar: {
          height: theme.spacing(0.2),
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#0C030E",
          padding: 0,
        },
        action: {
          padding: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
          color: alpha(theme.palette.common.white, 0.6),
          textTransform: "capitalize",
          fontSize: "1.25rem",
          "&.Mui-selected": {
            border: "2px solid #6D3ED1",
            color: theme.palette.common.white,
            background: alpha(theme.palette.primary.main, 0.1),
          },
          "&.Mui-disabled": {
            border: `2px solid ${alpha(theme.palette.primary.main, 0.05)}`,
            color: alpha(theme.palette.common.white, 0.16),
            background: "inherit",
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "inherit",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "1.8rem 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        },
        head: {
          padding: theme.spacing(2, 0),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          "& .MuiAlert-icon": {
            padding: 0,
          },
          "& .MuiAlert-message": {
            padding: 0,
          },
          "& .MuiAlert-action": {
            padding: 0,
          },
          "& .MuiSvgIcon-root": {
            fontSize: "18px",
          },
        },
        filledWarning: {
          background: alpha(theme.palette.success.main, 0.1),
          "& .MuiAlert-message": {
            color: theme.palette.warning.main,
          },
          "& .MuiSvgIcon-root": {
            color: theme.palette.warning.main,
          },
        },
        filledError: {
          background: alpha(theme.palette.error.main, 0.1),
          "& .MuiAlert-message": {
            color: theme.palette.error.main,
          },
          "& .MuiSvgIcon-root": {
            color: theme.palette.error.main,
          },
        },
      },
    },
  },
} as unknown as IThemeOptions);

export default theme;
