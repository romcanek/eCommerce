import { Box, Typography, Paper, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_BOUGHT_ITEM } from "../mutations/itemMutations";
import { GET_ITEMS } from "../queries/itemQueries";
import { GET_USER } from "../queries/userQueries";
import { toast } from "react-toastify";
import { decrement } from "../redux/cartSlice";

function CartItem({ item, userId }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const id = item.id;

    const [deleteBoughtItem] = useMutation(DELETE_BOUGHT_ITEM, {
        variables: { id, userId },
        refetchQueries: [GET_USER, GET_ITEMS],
    });

    const handleDelete = () => {
        deleteBoughtItem()
            .then((res) => {
                toast("Předmět byl úspěšně smazán", {
                    type: "success",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                });
                dispatch(decrement());
            })
            .catch((err) => {
                toast(err.message, {
                    type: "error",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                });
            });
    };

    return (
        <Paper
            elevation={5}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2em",
                width: "80vw",
                overflowX: "auto",
                paddingBlock: ".5em",
                paddingInline: "2em",
                textAlign: "center",
                borderRadius: "10px",
                whiteSpace: "nowrap",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2em",
                }}
            >
                <Typography variant="h6" sx={{ maxWidth: "16em" }}>
                    {item.name}
                </Typography>
                <Box
                    component="img"
                    src={item.img}
                    alt="item image"
                    sx={{ maxHeight: "5em" }}
                />
            </Box>
            <Typography variant="h6">{item.price}</Typography>
            <Box sx={{ display: "flex", gap: "3em", alignItems: "center" }}>
                <Typography variant="h6">{quantity}</Typography>
                <Button variant="text" color="error" onClick={handleDelete}>
                    X
                </Button>
            </Box>
        </Paper>
    );
}

export default CartItem;
