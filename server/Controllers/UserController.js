const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Part = require("../Models/Part");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const passwordCompare = await bcrypt.compare(
				password,
				user.password
			);
			if (passwordCompare) res.status(200).send(user);
			else res.status(401).send("Incorrect email or password!");
		} else res.status(401).send(`No account with email ${email}!`);
	} catch (e) {
		res.status(400).send(e);
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (e) {
		res.status(400).json({ Error: e });
	}
};

const createUser = async (req, res) => {
	const { fName, lName, username, email, password } = req.body;
	const foundUser = await User.findOne({ email: email });
	if (foundUser) {
		return res.status(409).send("User already exists!");
	}

	const saltRounds = 10;

	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		const newUser = new User({
			firstName: fName,
			lastName: lName,
			username,
			email,
			password: hashedPassword,
			cart: [],
			orders: [],
		});

		await newUser.save();
		res.status(201).send("User created successfully");
	} catch (e) {
		res.status(500).send(e);
	}
};

const deleteUser = async (req, res) => {
	const account = req.body;
	try {
		const user = await User.findByIdAndDelete(account._id);

		if (!user) return res.status(404).send("User not found!");
		res.status(200).send("Server - Account successfully deleted!");
	} catch (e) {
		res.status(500).send(e);
	}
};

const addToCart = async (req, res) => {
	const { account, product } = req.body;
	try {
		const user = await User.findById(account._id);

		if (!user) return res.status(404).send("User not found!");
		user.cart.push(product);
		await user.save();
		res.status(200).send(user);
	} catch (e) {
		res.status(500).send(e);
	}
};

const removeFromCart = async (req, res) => {
	const { account, product } = req.body;

	try {
		const user = await User.findById(account._id);

		if (!user) return res.status(404).send("User not found!");
		const indexRemove = user.cart.findIndex(
			(cartProduct) => cartProduct._id === product._id
		);
		if (indexRemove == -1) {
			console.log("product not found!");
			return res.status(404).send("Product not found!");
		}
		user.cart = account.cart;
		user.cart.splice(indexRemove, 1);
		await user.save();
		res.status(200).send(user);
	} catch (e) {
		res.status(500).send(e);
	}
};

const checkout = async (req, res) => {
	const items = req.body;
	const productIDArray = items.map((product) => product._id);
	const productsFromDB = await Part.find({ _id: { $in: productIDArray } });
	// console.log(productsFromDB);
	const lineItems = productsFromDB.map((product, index) => ({
		price_data: {
			currency: "eur",
			product_data: {
				name: product.title,
				images: [product.image],
			},
			unit_amount: Math.round(product.price * 100),
		},
		quantity: items[index].quantity,
	}));

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment",
		success_url: `${process.env.CLIENT_HOST_MODE_URL}/success`,
		cancel_url: `${process.env.CLIENT_HOST_MODE_URL}/cart`,
	});

	res.json({ id: session.id });
};

const updateUserAfterPayment = async (req, res) => {
	const updatedUser = req.body;
	try {
		const user = await User.findByIdAndUpdate(updatedUser._id, updatedUser);
		if (!user) return res.status(404).send("User not found!");
		res.status(200).send();
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports = {
	getUser,
	getUsers,
	createUser,
	addToCart,
	removeFromCart,
	checkout,
	updateUserAfterPayment,
	deleteUser,
};
