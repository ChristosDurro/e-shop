const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	cart: {
		type: [Object],
		required: false,
	},
	orders: {
		type: [Object],
		required: false
	}
});

module.exports = mongoose.model("User", UserSchema);