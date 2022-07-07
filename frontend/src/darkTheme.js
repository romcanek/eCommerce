import { createTheme } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        primary: {
            dark: "#7a0909",
            main: "#911010",
            light: "#c72020",
        },
        secondary: {
            main: "#5a76f1",
        },
        mode: "dark",
    },
});

export default darkTheme;
