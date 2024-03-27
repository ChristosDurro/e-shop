const express = require("express");
const cors = require("cors");
const dbConnection = require("./db");
const {
	getParts,
	getPart,
	updateParts,
} = require("./Controllers/PartController");
const {
	getCategories,
	getCategory,
} = require("./Controllers/CategoryController");
const {
	getUser,
	getUsers,
	createUser,
	addToCart,
	removeFromCart,
	checkout,
	updateUserAfterPayment,
	deleteUser,
} = require("./Controllers/UserController");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

require("dotenv").config();

const port = process.env.PORT || 8000;
const uri = `mongodb+srv://admin-chris:${process.env.DB_PASSWORD}@cluster0.70is7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

dbConnection(uri);

app.route("/test")
	.get((req, res) => {
		res.send("Get Test");
	})
	.post((req, res) => {
		res.send("Post Test");
	});

// ----- PARTS -----
app.get("/parts", getParts);
app.get("/parts/:id", getPart);
app.patch("/parts/update", updateParts);

// ----- CATEGORIES -----
app.get("/categories", getCategories);
app.get("/categories/:id", getCategory);

// ----- USERS -----
app.get("/users", getUsers);
app.post("/users/login", getUser);
app.post("/users/create", createUser);
app.delete("/users/delete", deleteUser);
app.post("/user/add/cart", addToCart);
app.post("/user/delete/cart", removeFromCart);
app.post("/create-checkout-session", checkout);
app.post("/update-user", updateUserAfterPayment);

app.listen(port, "0.0.0.0", () => {
	console.log(`Server listening to port ${port}`);
});
