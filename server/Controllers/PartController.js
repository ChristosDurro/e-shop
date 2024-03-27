const mongoose = require("mongoose");
const Part = require("../Models/Part");

const getParts = async (req, res) => {
	try {
		const parts = await Part.find();
		res.status(200).json(parts);
	} catch (e) {
		res.status(400).json({ "Error ": e });
	}
};

const getPart = async (req, res) => {
	const { id } = req.params;
	try {
		const part = await Part.findById({ _id: id });
		res.status(200).json(part);
	} catch (e) {
		res.status(400).json({ "Error ": e });
	}
};

const updateParts = async (req, res) => {
	try {
		await Part.updateMany({}, { $set: { description: "" } });
		res.status(200).send(await Part.find({}));
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports = {
	getParts,
	getPart,
	updateParts,
};
