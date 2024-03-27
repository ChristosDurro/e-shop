const mongoose = require("mongoose")
const Category = require("../Models/Category");

const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json(categories);
	}
	catch (e) {
		res.status(400).json({"Error": e});
	}
};

const getCategory = async (req, res) => {
	const {id} = req.params;

	try {
		const category = await Category.findById({_id: id});
		res.status(200).json(category);
	}
	catch (e) {
		res.status(400).json({"Error": e});
	}
};

module.exports = {
	getCategories,
	getCategory
};