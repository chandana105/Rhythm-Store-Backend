const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { initializeDBConnection } = require("./db/db.connect.js");
const { errorHandler } = require("./middlewares/error-handler.middleware.js");
const {
  routeNotFound,
} = require("./middlewares/route-not-found.middleware.js");



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

initializeDBConnection();


const insertIntoDB = require("./routes/insertIntoDB.router");
const products = require("./routes/product.router");

app.get("/", (_, res) => {
  res.json("Hello World");
});

app.use("/insert", insertIntoDB);
app.use("/products", products);

// Keep at end to handle errors and 404s
app.use(routeNotFound);
app.use(errorHandler);

const PORT =  5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
