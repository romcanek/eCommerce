import { Typography, TextField, Button, Box } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../mutations/userMutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setItems } from "../redux/cartSlice";
import { login } from "../redux/authSlice";
import { initUser } from "../redux/userSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [addUser] = useMutation(ADD_USER, {
        variables: { name, email, password },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== password2) {
            toast("Hesla se neshodují", {
                type: "error",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                draggable: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            setPassword("");
            setPassword2("");
            return;
        }

        addUser(name, email, password)
            .then((res) => {
                if (res.data.addUser == null) {
                    toast("Uživatel s touto emailovou adresou již existuje", {
                        type: "error",
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        draggable: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });

                    return;
                } else {
                    localStorage.setItem("acc", JSON.stringify(res.data.addUser.id));
                    dispatch(initUser(res.data.addUser));
                    dispatch(setItems(0));
                    dispatch(login());
                    navigate("/");
                }
            })
            .catch((err) => {
                toast(`${err}`, {
                    type: "error",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    draggable: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                return;
            });

        setPassword("");
        setPassword2("");
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
                    Registrace
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
                            setName(e.target.value);
                        }}
                        value={name}
                        label="Jméno"
                        sx={{ width: "25em" }}
                    ></TextField>
                    <TextField
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        value={email}
                        label="Email"
                        type="email"
                        sx={{ width: "25em" }}
                    ></TextField>
                    <TextField
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        value={password}
                        label="Heslo"
                        type="password"
                        sx={{ width: "25em" }}
                    ></TextField>
                    <TextField
                        onChange={(e) => {
                            setPassword2(e.target.value);
                        }}
                        value={password2}
                        label="Zopakujte heslo"
                        type="password"
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
                </form>
            </Box>
        </>
    );
}

export default Login;
