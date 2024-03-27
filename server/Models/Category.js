const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	category: {
		type: String,
		required: true
	},
	subcategories: {
		type: [String],
		required: true
	},
	image: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Category", CategorySchema);