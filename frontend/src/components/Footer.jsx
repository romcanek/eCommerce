import { Container, Box, Typography } from "@mui/material";

function Footer() {
    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                paddingBlock: ".75em",
                height: "50px",
                background: "rgb(145,16,16)",
                background: "linear-gradient(90deg, rgba(145,16,16,1) 40%, #324dc5ff 100%)",
            }}
        >
            <Container maxWidth="x1">
                <Typography sx={{ textAlign: "center" }}>&copy; Roman Tarnai 2022</Typography>
            </Container>
        </Box>
    );
}

export default Footer;
