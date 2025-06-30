const express = require("express");
const path = require("node:path");
const inventoryRouter = require("./routes/userRouter");
require("dotenv").config();

// Running Main Router
const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing for form submissions
app.use(express.urlencoded({ extended: true }));

// Mount our users router at "/"
app.use("/", inventoryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
