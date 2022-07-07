const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
require("dotenv").config();
const cors = require("cors");
const schema = require("./schema/schema");
const { graphqlHTTP } = require("express-graphql");
const port = process.env.PORT || 5000;

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(port, () => console.log(`Listening on port ${port}`));
