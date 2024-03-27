const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartSchema = new Schema({
	category: {
		type: String,
		required: true,
	},
	subcategory: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	details: {
		type: Object,
		required: true,
	},
	inStock: {
		type: Boolean,
		required: true,
	},
});

module.exports = mongoose.model("Part", PartSchema);
