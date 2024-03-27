
const mongoose = require("mongoose");


const dbConnection = (uri) => {
	mongoose.connect(uri)
	.then(() => {
		console.log("Successfully connected to database!");
	})
	.catch((e) => {
		console.log("Error: ", e);
	});
}

module.exports = dbConnection;