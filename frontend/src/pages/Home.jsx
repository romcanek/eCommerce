import Items from "../components/Items";
import { Box, Button } from "@mui/material";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import NewItemModal from "../components/NewItemModal";
import { GET_USERS } from "../queries/userQueries";
import { useEffect } from "react";

function Home() {
    const { data, loading, error } = useQuery(GET_USERS);

    const [admin, setAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!loading) {
            const token = localStorage.getItem("acc");
            if (token) {
                const user = data.users.find((user) => user.id === JSON.parse(token));
                if (user) {
                    setAdmin(user.admin);
                }
            }
        }
    }, [loading, data]);

    // filter buttons styles
    const [selected, setSelected] = useState("");

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2em" }}
        >
            {admin && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: "flex-start" }}
                    onClick={() => {
                        setShowModal(true);
                    }}
                >
                    Přidat nový předmět
                </Button>
            )}
            <Box
                sx={{
                    gap: ".5em",
                    display: "flex",
                    alignSelf: "flex-start",
                    "@media only screen and (max-width: 450px)": {
                        flexDirection: "column",
                        width: "100%",
                        gap: "1em",
                    },
                }}
            >
                <Button
                    color="secondary"
                    variant={selected == "nejlevnější" ? "contained" : "outlined"}
                    onClick={() => {
                        setSelected("nejlevnější");
                    }}
                >
                    Nejlevnější
                </Button>
                <Button
                    color="secondary"
                    variant={selected == "nejdražší" ? "contained" : "outlined"}
                    onClick={() => {
                        setSelected("nejdražší");
                    }}
                >
                    Nejdražší
                </Button>
                <Button
                    color="secondary"
                    variant={selected == "značka" ? "contained" : "outlined"}
                    onClick={() => {
                        setSelected("značka");
                    }}
                >
                    Značka
                </Button>
                <Button
                    variant="text"
                    color="primary"
                    sx={{ marginLeft: "1em" }}
                    onClick={() => {
                        setSelected("");
                    }}
                >
                    Reset
                </Button>
            </Box>

            <NewItemModal showModal={showModal} setShowModal={setShowModal} />
            <Box
                sx={{
                    gap: "3em",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    "@media only screen and (max-width: 1210px)": {
                        gridTemplateColumns: "repeat(3, 1fr)",
                    },
                    "@media only screen and (max-width: 850px)": {
                        gridTemplateColumns: "repeat(2, 1fr)",
                        columnGap: "1.5em",
                    },
                    "@media only screen and (max-width: 575px)": {
                        gridTemplateColumns: "repeat(1, 1fr)",
                    },
                }}
            >
                <Items filter={selected} />
            </Box>
        </Box>
    );
}

export default Home;
