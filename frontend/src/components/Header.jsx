import { AppBar, Container, Box, Typography, Button, Paper } from "@mui/material";
import ShopIcon from "@mui/icons-material/Shop";
import LoginIcon from "@mui/icons-material/Login";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../queries/userQueries";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/authSlice";
import { initUser, dropUser } from "../redux/userSlice";
import { toggleTheme } from "../redux/themeSlice";
import ThemeSwitch from "./ThemeSwitch";
import { setItems } from "../redux/cartSlice";

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const signingIn = location.pathname === "/login" || location.pathname === "/register";

    // dropdown menu
    const [droppedDown, setDroppedDown] = useState(false);

    // logging in
    const { data, loading, error } = useQuery(GET_USERS);
    const { logged } = useSelector((state) => state.logger);
    // getting data for user
    const { user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);

    const [showLogin, setShowLogin] = useState(signingIn || user ? false : true);
    /* dont show login button on login page */
    useEffect(() => {
        const signingIn = location.pathname === "/login" || location.pathname === "/register";
        setShowLogin(signingIn ? false : true);
        const token = localStorage.getItem("acc");
        if (token) {
            setShowLogin(false);
        }
    }, [useLocation(), location]);

    useEffect(() => {
        if (!loading) {
            loadUser();
        }
    }, [loading]);

    /* Loads user data from database if theres saved id of user in localstorage */
    const loadUser = () => {
        const token = localStorage.getItem("acc");
        if (token != null && !user) {
            const userData = data?.users?.find((user) => user.id === JSON.parse(token));
            dispatch(initUser(userData));
            dispatch(login());
            dispatch(setItems(userData.itemsIDs.length));
        } else if (token && user) {
            dispatch(login());
        } else if (!token) {
            dispatch(logout());
        }
    };
    /* if theres id of user in localstorage dont show login button the user will get logged after database loads */
    useEffect(() => {
        const token = localStorage.getItem("acc");
        if (token) {
            setShowLogin(false);
        }
    }, []);

    /* Theme switch */
    const theme = useSelector((state) => state.theme.theme);
    const [activeSwitch, setActiveSwitch] = useState(false);
    useEffect(() => {
        if (theme == "dark") {
            setActiveSwitch(true);
        } else {
            setActiveSwitch(false);
        }
    }, [theme]);

    return (
        <AppBar
            position="sticky"
            sx={{
                top: 0,
                paddingBlock: ".75em",
                background: "rgb(145,16,16)",
                background: "linear-gradient(90deg, rgba(145,16,16,1) 40%, #324dc5ff 100%)",
            }}
        >
            <Container maxWidth="x1">
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        justifyContent: "space-between",
                        "@media only screen and (max-width: 500px)": {
                            gap: "1em",
                            flexDirection: "column",
                        },
                    }}
                >
                    <Box display="flex" alignItems="center" gap="1em">
                        <ShopIcon sx={{ fontSize: "3rem" }} />
                        <Typography
                            onClick={() => navigate("/")}
                            variant="h4"
                            sx={{ cursor: "pointer" }}
                        >
                            RAR.RU
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="1em">
                        <ThemeSwitch
                            checked={activeSwitch}
                            onClick={() => {
                                dispatch(toggleTheme());
                            }}
                        />

                        {logged ? (
                            <Box sx={{ display: "flex", gap: "2em", alignItems: "center" }}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        navigate("./cart", {
                                            state: { userID: user.id },
                                        });
                                    }}
                                >
                                    <ShoppingCartIcon fontSize="large" />

                                    {cartItems > 0 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                backgroundColor: "primary.main",
                                                borderRadius: "100vh",
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                top: "-10%",
                                                right: "-10%",
                                            }}
                                        >
                                            {cartItems}
                                        </Box>
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                        setDroppedDown(!droppedDown);
                                    }}
                                >
                                    <AccountCircleIcon fontSize="large" />
                                    {droppedDown ? (
                                        <Box sx={{ position: "relative" }}>
                                            <ArrowDropDownIcon sx={{ fontSize: "2em" }} />
                                            <Paper
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    position: "absolute",
                                                    left: "50%",
                                                    transform:
                                                        "translateX(-90%) translateY(105%)",
                                                    bottom: "0",
                                                    minWidth: "15em",
                                                    padding: "1em",
                                                    textAlign: "center",
                                                    gap: "1.5em",
                                                }}
                                            >
                                                <div>
                                                    <Typography variant="h5">
                                                        {user.name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {user.email}
                                                    </Typography>
                                                </div>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: "secondary.main" }}
                                                >
                                                    Věci v košíku:{" "}
                                                    {cartItems == null ? 0 : cartItems}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    onClick={(e) => {
                                                        localStorage.removeItem("acc");
                                                        dispatch(logout());
                                                        setShowLogin(true);
                                                        dispatch(dropUser());
                                                        if (location.pathname !== "/") {
                                                            navigate("/");
                                                        }
                                                    }}
                                                >
                                                    Odhlásit se
                                                </Button>
                                            </Paper>
                                        </Box>
                                    ) : (
                                        <ArrowDropUpIcon sx={{ fontSize: "2em" }} />
                                    )}
                                </Box>
                            </Box>
                        ) : null}
                        {showLogin && (
                            <Box>
                                <Button
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                    variant="contained"
                                    color="primary"
                                    sx={{ gap: ".5em" }}
                                >
                                    <LoginIcon /> Přihlásit se
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>
        </AppBar>
    );
}

export default Header;
