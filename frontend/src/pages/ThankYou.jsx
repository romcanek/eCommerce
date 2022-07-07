import { Box, Typography } from "@mui/material";

function ThankYou() {
    return (
        <Box
            sx={{
                width: "70vw",
                height: "70vh",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2em",
            }}
        >
            <Typography variant="h2" color="success.main">
                Vaše objednávka byla úspěšně vyřízena
            </Typography>
            <Typography variant="h3">Děkujeme za nákup</Typography>
            <Typography variant="h5">
                Za nedlouho obdržíte email s informacemi o objednávce
            </Typography>
        </Box>
    );
}

export default ThankYou;
