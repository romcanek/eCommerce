import { Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GET_USERS } from "../queries/userQueries";
import { useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { initUser } from "../redux/userSlice";
import { setItems } from "../redux/cartSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_USERS);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.users.find((user) => user.email === email && user.password === password)) {
            localStorage.setItem(
                "acc",
                JSON.stringify(data.users.find((user) => user.email === email).id)
            );
            dispatch(initUser(data.users.find((user) => user.email === email)));
            dispatch(
                setItems(data.users.find((user) => user.email === email).itemsIDs.length)
            );
            dispatch(login());
            navigate("/");
        } else {
            toast("Nesprávný email nebo heslo", {
                type: "error",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                draggable: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                sx={{ minHeight: "80vh", justifyContent: "center" }}
            >
                <Typography variant="h2" sx={{ marginBottom: "1em" }}>
                    Přihlášení
                </Typography>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.5em",
                        flexDirection: "column",
                    }}
                >
                    <TextField
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        type="email"
                        value={email}
                        label="Email"
                        sx={{ width: "25em" }}
                    ></TextField>
                    <TextField
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        type="password"
                        value={password}
                        label="Heslo"
                        sx={{ width: "25em" }}
                    ></TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ gap: ".5em", width: "29em" }}
                    >
                        Přihlásit
                    </Button>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="body1">
                            Jestli ještě nemáš účet můžeš si ho vytvořit zde:
                        </Typography>
                        <Typography
                            onClick={() => navigate("/register")}
                            variant="body1"
                            sx={{
                                color: "#2f3ce7",
                                cursor: "pointer",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Registrace
                        </Typography>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default Login;
