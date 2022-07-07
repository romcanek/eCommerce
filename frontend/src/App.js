import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import { Container } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { setTheme } from "./redux/themeSlice";
import { useSelector } from "react-redux";

const client = new ApolloClient({
    uri: "http://localhost:5000/graphql",
    cache: new InMemoryCache(),
});

function App() {
    const dispatch = useDispatch();
    const prefTheme =
        localStorage.getItem("pref") != null ? localStorage.getItem("pref") : "dark";

    dispatch(setTheme(prefTheme));

    const theme = useSelector((state) => state.theme.theme);
    const desiredTheme = theme;

    const [activeTheme, setActiveTheme] = useState(darkTheme);

    useEffect(() => {
        if (desiredTheme === "dark") {
            setActiveTheme(darkTheme);
        } else {
            setActiveTheme(lightTheme);
        }
    }, [desiredTheme]);

    return (
        <ApolloProvider client={client}>
            <Router>
                <ToastContainer />
                <ThemeProvider theme={activeTheme}>
                    <CssBaseline />
                    <Header />
                    <Container
                        sx={{
                            marginTop: "3em",
                            marginBottom: "10em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingBottom: "10em",
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/product" element={<Product />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/thankyou" element={<ThankYou />} />
                        </Routes>
                    </Container>
                    <Footer />
                </ThemeProvider>
            </Router>
        </ApolloProvider>
    );
}

export default App;
