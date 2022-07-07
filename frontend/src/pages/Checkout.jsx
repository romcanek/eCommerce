import {
    Box,
    Button,
    FormControlLabel,
    Radio,
    Typography,
    Paper,
    Divider,
    RadioGroup,
    TextField,
    Checkbox,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { DELETE_ALL_BOUGHT_ITEMS } from "../mutations/itemMutations";
import { useMutation } from "@apollo/client";
import { GET_ITEMS } from "../queries/itemQueries";
import { GET_USER } from "../queries/userQueries";
import { decrement } from "../redux/cartSlice";
import emailjs from "@emailjs/browser";

function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const total = location.state.total;
    const items = location.state.items;

    const user = useSelector((state) => state.user.user);
    const userID = user?.id;

    const [grandTotal, setGrandTotal] = useState(total);
    const [doprava, setDoprava] = useState(null);
    const [platba, setPlatba] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [souhlas, setSouhlas] = useState(false);

    const userId = user?.id;
    const [deleteAllBoughtItems] = useMutation(DELETE_ALL_BOUGHT_ITEMS, {
        variables: { userId },
        refetchQueries: [GET_USER, GET_ITEMS],
    });

    useEffect(() => {
        if (doprava) {
            setGrandTotal(total + doprava);
        } else if (platba) {
            setGrandTotal(total + platba);
        }

        if (doprava && platba) {
            setGrandTotal(doprava + platba + total);
        }
    }, [doprava, platba, grandTotal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            name &&
            email &&
            country &&
            city &&
            zip &&
            address &&
            phone &&
            souhlas &&
            doprava &&
            platba
        ) {
            emailjs
                .send(
                    "service_2leofpa",
                    "template_9h3qjge",
                    {
                        name: name,
                        email: email,
                        price: `${grandTotal.toLocaleString()} Kč`,
                        address: `${country}, ${city}, ${zip}, ${address}`,
                    },
                    "h843ifvFtSHOSYb_n"
                )
                .then(
                    (result) => {
                        console.log(result.text);
                    },
                    (error) => {
                        console.log(error.text);
                    }
                );
            emailjs
                .send(
                    "service_2leofpa",
                    "template_yn2rn6w",
                    {
                        ids: `${items.map((item) => `${item.id} `)}`,
                        email: "roman.tarnai.04@gmail.com",
                        userID: userID,
                    },
                    "h843ifvFtSHOSYb_n"
                )
                .then(
                    (result) => {
                        console.log(result.text);
                        deleteAllBoughtItems(userId)
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        items.forEach((item) => {
                            dispatch(decrement());
                        });
                        navigate("/thankyou");
                    },
                    (error) => {
                        console.log(error.text);
                    }
                );
        } else {
            toast("Vyplňte všechny povinné údaje a vyberte možnost dopravy a platby", {
                type: "error",
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            });
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "2em",
                width: "80vw",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ alignSelf: "center", marginBottom: "1em", textAlign: "center" }}
                >
                    Zvolte dopravu a způsob platby
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid gray",
                        paddingBottom: ".5em",
                    }}
                >
                    <RadioGroup sx={{ width: "100%" }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <FormControlLabel
                                value="csp"
                                control={<Radio />}
                                label="Česká pošta - balík do ruky"
                                onChange={(e) => {
                                    if (e.target.value === "csp") {
                                        setDoprava(95);
                                    }
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "1em",
                                    justifySelf: "flex-end",
                                }}
                            >
                                <Typography variant="subtitle1">Cena:</Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="error.main"
                                    sx={{
                                        fontWeight: "bold",
                                        width: "5em",
                                        textAlign: "right",
                                    }}
                                >
                                    95 Kč
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <FormControlLabel
                                value="ppl"
                                control={<Radio />}
                                label="PPL - Kurýr"
                                onChange={(e) => {
                                    if (e.target.value === "ppl") {
                                        setDoprava(80);
                                    }
                                }}
                            />
                            <Box sx={{ display: "flex", gap: "1em", justifySelf: "flex-end" }}>
                                <Typography variant="subtitle1">Cena:</Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="error.main"
                                    sx={{
                                        fontWeight: "bold",
                                        width: "5em",
                                        textAlign: "right",
                                    }}
                                >
                                    80 Kč
                                </Typography>
                            </Box>
                        </Box>
                    </RadioGroup>

                    <Box sx={{ display: "flex", gap: "1em" }}></Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "2px solid gray",
                        paddingBlock: ".5em",
                    }}
                >
                    <FormControlLabel
                        value="dobirka"
                        control={<Radio />}
                        label="Dobírka"
                        onChange={(e) => {
                            if (e.target.value === "dobirka") {
                                setPlatba(35);
                            }
                        }}
                    />
                    <Box sx={{ display: "flex", gap: "1em" }}>
                        <Typography variant="subtitle1">Cena:</Typography>
                        <Typography
                            variant="subtitle1"
                            color="error.main"
                            sx={{ fontWeight: "bold", width: "5em", textAlign: "right" }}
                        >
                            35 Kč
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                }}
            >
                {items.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
                            <Typography variant="subtitle1">cena:</Typography>
                            <Typography
                                variant="subtitle1"
                                color="info.main"
                                sx={{ fontWeight: "bold", width: "5em", textAlign: "right" }}
                            >
                                {item.price}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "1em",
                    }}
                >
                    <Typography variant="h6">Celková cena:</Typography>
                    <Typography variant="h5" color="info.main" sx={{ fontWeight: "bold" }}>
                        {grandTotal.toLocaleString()} Kč
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderBottomWidth: "3px", borderColor: "primary.main" }} />

            <form
                onSubmit={handleSubmit}
                style={{
                    marginTop: "1em",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: ".8em", textAlign: "center" }}>
                    Informace pro dodání zboží
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <TextField
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        value={name}
                        label="Jméno a Přijmení"
                        sx={{ width: "49%" }}
                    />
                    <TextField
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        value={email}
                        label="Email"
                        type="email"
                        sx={{ width: "49%" }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "1.2em",
                    }}
                >
                    <TextField
                        onChange={(e) => {
                            setCountry(e.target.value);
                        }}
                        value={country}
                        label="Stát"
                        sx={{ width: "49%" }}
                    />
                    <TextField
                        onChange={(e) => {
                            setCity(e.target.value);
                        }}
                        value={city}
                        label="Město"
                        sx={{ width: "49%" }}
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <TextField
                        onChange={(e) => {
                            setZip(e.target.value);
                        }}
                        value={zip}
                        label="PSČ"
                        sx={{ width: "49%" }}
                    />
                    <TextField
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                        value={address}
                        label="Ulice a č.p."
                        sx={{ width: "49%" }}
                    />
                </Box>
                <TextField
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                    value={phone}
                    label="Telefon"
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1em",
                        alignItems: "flex-start",
                    }}
                >
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Souhlasím s licenčními podmínkami"
                        onChange={(e) => {
                            setSouhlas(e.target.checked);
                        }}
                        sx={{ marginLeft: ".25em" }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ width: "25%", alignSelf: "flex-end", minWidth: "10em" }}
                    >
                        Objednat
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default Checkout;
