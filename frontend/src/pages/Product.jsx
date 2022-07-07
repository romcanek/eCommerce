import { Typography, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ITEM } from "../queries/itemQueries";
import { useState, useEffect } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BUY_ITEM } from "../mutations/itemMutations";
import { GET_USER } from "../queries/userQueries";
import { toast } from "react-toastify";
import { increment } from "../redux/cartSlice";

function Product() {
    const navigate = useNavigate();
    const id = useLocation().state?.id;

    const { data, loading, error } = useQuery(GET_ITEM, {
        variables: { id: id },
    });

    const [item, setItem] = useState(null);

    useEffect(() => {
        if (!loading) {
            setItem(data?.item);
        }
    }, [loading]);

    /* shupping */
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

    const [buyItem] = useMutation(BUY_ITEM, {
        variables: { id: item?.id, userId: user?.id },
        refetchQueries: [GET_USER],
    });

    const handleClick = () => {
        if (!user) {
            toast("Pro objednávku musíte být přihlášen", {
                type: "error",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            });
            return;
        }
        buyItem()
            .then((res) => {
                toast("Předmět byl úspěšně přidán do košíku", {
                    type: "success",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                });
                dispatch(increment());
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

    if (loading) return <div>Loading...</div>;

    return (
        <>
            {!id && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "80vh",
                        gap: "1em",
                    }}
                >
                    <Typography variant="h2">ERROR: 404</Typography>
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                        Něco se nepovedlo, pravěpodobně jste se sem dostali jinak než použitím
                        odkazu při kliknutí na předmět v obchodě
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Vrátit se zpět
                    </Button>
                </Box>
            )}
            {data && (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gridTemplateRows: "repeat(2, 1fr)",
                        gridTemplateAreas: `
                        "tim desc"
                        "tim price"
                    `,
                        minHeight: "80vh",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "3em",
                        "@media only screen and (max-width: 1000px)": {
                            paddingInline: "1em",
                            gridTemplateColumns: "1fr",
                            gridTemplateAreas: `
                            "tim"
                            "tim"
                            "desc"
                            "price"
                            `,
                        },
                    }}
                >
                    <Box
                        sx={{
                            gridArea: "tim",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2em",
                            alignItems: "center",
                            justifyContent: "space-around",
                            alignSelf: "flex-start",
                            height: "100%",
                        }}
                    >
                        <Typography variant="h3">{item?.name}</Typography>
                        <Box
                            component="img"
                            src={item?.img}
                            alt="image of an item"
                            sx={{
                                gridArea: "tim",
                                "@media only screen and (max-width: 1000px)": {
                                    width: "18em",
                                },
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            gridArea: "desc",
                            fontWeight: "normal",
                            marginTop: "2em",
                            textAlign: "justify",
                        }}
                    >
                        {item?.description}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "3em",
                            gridArea: "price",
                            "@media only screen and (max-width: 1000px)": {
                                marginTop: "3em",
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                gridArea: "desc",
                                color: `${item?.inStock > 0 ? "success.main" : "error.main"}`,
                            }}
                        >
                            Skladem: {item?.inStock} kusů
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: ".5em",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h4">{item?.price}</Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    width: "18em",
                                    height: "3em",
                                    display: "block",
                                    margin: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    columnGap: "1em",
                                }}
                                onClick={handleClick}
                            >
                                <AddShoppingCartIcon /> Přidat do košíku
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default Product;
