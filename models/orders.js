const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
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
			enum: ["Delivered", "Dispatched", "Ready to dispatch"],
			default: "Ready to dispatch",
		},
		email: {
			type: String,
			required: [true, "Please provide email"],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
			unique: false,
		},
		contact: {
			type: String,
			required: [true, "Please provide contact number"],
			match: [
				/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
				"Please enter valid contact mumber",
			],
			unique: false,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide User"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
