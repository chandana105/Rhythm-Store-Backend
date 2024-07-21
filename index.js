const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initializeDBConnection } = require("./db/db.connect.js");
const { errorHandler } = require("./middlewares/error-handler.middleware.js");
const {
  routeNotFound,
} = require("./middlewares/route-not-found.middleware.js");
const { authVerify } = require("./middlewares/auth-handler.middleware.js");

const app = express();
app.use(bodyParser.json());
// Configure CORS to allow requests from your frontend's origin
app.use(cors({
  origin: 'https://rhythm-store.netlify.app', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow cookies and other credentials
}));

// Handle preflight requests
app.options('*', cors({
  origin: 'https://rhythm-store.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

initializeDBConnection();

const insertIntoDB = require("./api/insertIntoDB.router.js");
const products = require("./api/product.router.js");
const categories = require("./api/category.router.js");
const user = require("./api/user.router.js");
const auth = require("./api/auth.router.js");
const cart = require("./api/cart.router.js");
const wishlist = require("./api/wishlist.router.js");

app.get("/", (_, res) => {
  res.json("Welcome To Rhythm Store");
});

app.use("/insert", insertIntoDB);
app.use("/products", products);
app.use("/categories", categories);
app.use("/auth", auth);
app.use("/user", authVerify, user);
app.use("/cart", authVerify, cart);
app.use("/wishlist", authVerify, wishlist);

// Keep at end to handle errors and 404s
app.use(routeNotFound);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
