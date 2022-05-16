const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
	{
		itemId: {
			type: Number,
			required: [true, "Please provide Item Id"],
			maxlength: 50,
			unique: true,
		},
		itemName: {
			type: String,
			required: [true, "Please provide Item Name"],
			maxlength: 100,
		},
		price: {
			type: Number,
			required: [true, "Please provide price"],
			match: [
				/^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/,
				"Please provide a valid amount",
			],
		},
		status: {
			type: String,
			enum: ["Sold", "Not Sold"],
			default: "Not Sold",
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide User"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Stock", StockSchema);
