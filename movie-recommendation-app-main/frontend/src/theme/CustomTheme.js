import { colors } from "../utils/colors";

export const themeOptions = {
    typography: {
        fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#46b989", // Used elsewhere
        },
        success: {
            main: "#11C6A9", // custom button color (seafoam green)
            contrastText: "#ffffff", // custom button text (white)
        },
        error: {
            main: "#C6112E", // custom button color (red)
        },
        secondary: {
            main: "#46b989",
        },
        warning: {
            main: "#00526b", // custom button color (seafoam green)
            contrastText: "#ffffff", // custom button text (white)
        },
    },
    shape: {
        borderRadius: 50,
    },
}