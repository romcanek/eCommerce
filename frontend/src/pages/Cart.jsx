import { useQuery } from "@apollo/client";
import { GET_ITEMS } from "../queries/itemQueries";
import { GET_USER } from "../queries/userQueries";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartItem from "../components/CartItem";

function Cart() {
    const navigate = useNavigate();
    const [items, setItems] = useState(null);
    const [total, setTotal] = useState(0);
    const [totalAsPrice, setTotalAsPrice] = useState(0);
    const { userID } = useLocation().state;

    const { data, loading, error } = useQuery(GET_ITEMS);
    const {
        data: userData,
        loading: userLoading,
        error: userError,
    } = useQuery(GET_USER, {
        variables: { id: userID },
    });

    useEffect(() => {
        if (!loading && !userLoading) {
            const itemsIDs = userData.user.itemsIDs;
            const itemy = data.items.filter((item) => itemsIDs.includes(item.id));
            setItems(itemy);
            countTotal(itemy);
        }
    }, [loading, data, userLoading, userData]);

    useEffect(() => {
        setTotalAsPrice(NumberToPrice(total));
    }, [total]);

    const PriceToNumber = (price) => {
        return Number(price.replace("Kč", "").replace(" ", ""));
    };

    const NumberToPrice = (num) => {
        let number = num.toLocaleString();
        return number;
    };

    const countTotal = (items) => {
        let totalcena = 0;
        items?.forEach((item) => {
            totalcena += PriceToNumber(item.price);
        });
        setTotal(totalcena);
    };

    if (loading || userLoading) return <p>Loading...</p>;
    if (error || userError) return <p>Error: {error.message}</p>;

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {items?.length === 0 && (
                <Typography variant="h3" sx={{ textAlign: "center" }}>
                    Váš košík je prázdný
                </Typography>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
                {items?.map((item) => (
                    <CartItem key={item.id} item={item} userId={userID} />
                ))}
            </Box>
            <Box
                sx={{
                    alignSelf: "center",
                    marginTop: "3em",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1em",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
                    <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                        Celkem k úhradě:{" "}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="info.main"
                        sx={{ fontSize: "1.3rem" }}
                    >
                        {totalAsPrice} Kč
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "1.5em" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Zpět
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={items?.length > 0 ? false : true}
                        onClick={() => {
                            navigate("/checkout", { state: { total, items } });
                        }}
                    >
                        K pokladně
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Cart;
