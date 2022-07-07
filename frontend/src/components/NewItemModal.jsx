import { Paper, Typography, TextField, Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_ITEM } from "../mutations/itemMutations";
import { GET_ITEMS } from "../queries/itemQueries";
import { useState } from "react";
import { toast } from "react-toastify";

function NewItemModal({ showModal, setShowModal }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState("");
    const [inStock, setInStock] = useState("");

    const [addItem] = useMutation(ADD_ITEM, {
        variables: { name, price, description, img, inStock },
        refetchQueries: ["getItems"],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && price && description && img && inStock) {
            addItem(name, price, description, img, inStock)
                .then((res) => {
                    if (res.data.addItem == null) {
                        toast("Všechny pole formuláře musí být správně vyplněny", {
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
                        toast("Předmět byl úspěšně přidán", {
                            type: "success",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            draggable: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });

                        setShowModal(false);
                    }
                })
                .catch((err) => {
                    toast(err.message, {
                        type: "error",
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        draggable: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                });
        } else {
            toast("Všechny pole formuláře musí být správně vyplněny", {
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
        <Paper
            elevation={23}
            sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: showModal ? "flex" : "none",
                width: "50%",
                height: "65%",
                zIndex: "500",
                padding: "2em",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Button
                sx={{ position: "absolute", top: "2%", right: "2%", fontSize: "1.2rem" }}
                onClick={() => {
                    setShowModal(false);
                }}
            >
                x
            </Button>
            <Typography variant="h5" sx={{ marginBottom: "1.5em" }}>
                Nový předmět
            </Typography>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".75em",
                    width: "25em",
                    maxWidth: "95%",
                }}
                onSubmit={handleSubmit}
            >
                <TextField
                    label="Název"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                ></TextField>
                <TextField
                    label="Cena"
                    value={price}
                    onChange={(e) => {
                        setPrice(e.target.value);
                    }}
                ></TextField>
                <TextField
                    label="Popisek"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                ></TextField>
                <TextField
                    label="Odkaz na obrázek"
                    value={img}
                    onChange={(e) => {
                        setImg(e.target.value);
                    }}
                ></TextField>
                <TextField
                    label="Počet ve skladu"
                    value={inStock}
                    onChange={(e) => {
                        setInStock(e.target.value);
                    }}
                ></TextField>
                <Button type="submit" variant="contained">
                    Přidat předmět
                </Button>
            </form>
        </Paper>
    );
}

export default NewItemModal;
