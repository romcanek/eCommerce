import { Paper, Button, Typography, useTheme, Box } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { increment } from "../redux/cartSlice";
import { BUY_ITEM } from "../mutations/itemMutations";
import { GET_USER } from "../queries/userQueries";
import { toast } from "react-toastify";

function ItemCard({ item }) {
    const theme = useTheme();
    const navigate = useNavigate();
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

    return (
        <Paper
            elevation={theme.palette.mode === "light" ? 3 : 2}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                background: "background.paper",
                paddingBlock: "1.5em",
                paddingInline: ".5em",
                borderRadius: "15px",
                maxWidth: "350px",
                textAlign: "center",
            }}
        >
            <Box
                component="img"
                sx={{
                    width: "80%",
                    height: "300px",
                    objectFit: "contain",
                    cursor: "pointer",
                    transition: "transform .2s ease",
                    "&:hover": {
                        transform: "scale(1.1)",
                    },
                }}
                src={item.img}
                onClick={() => {
                    navigate("/product", { state: { id: item.id } });
                }}
            ></Box>
            <Typography
                variant="h4"
                onClick={() => {
                    navigate("/product", { state: { id: item.id } });
                }}
                sx={{
                    marginTop: ".5em",
                    color: "secondary.main",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    "&:hover": {
                        textDecoration: "underline",
                    },
                }}
            >
                {item.name}
            </Typography>
            <h2>{item.price}</h2>
            <Button
                variant="contained"
                color="primary"
                sx={{ gap: ".5em" }}
                onClick={handleClick}
            >
                <AddShoppingCartIcon /> Přidat do košíku
            </Button>
        </Paper>
    );
}

export default ItemCard;
