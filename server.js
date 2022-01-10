const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const orderRoutes = require("./routes/order");
app.use("/order", orderRoutes);
const campsRoutes = require("./routes/camps");
app.use("/camps", campsRoutes);

app.listen(3000, () => console.log("Server listening"));
