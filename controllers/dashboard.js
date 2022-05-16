const Stock = require("../models/stock");
const Orders = require("../models/orders");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllSales = async (req, res) => {
	const userId = req.user.userId;
	let currDate = new Date();

	const sales = await Orders.aggregate([
		{
			$match: {
				createdBy: mongoose.Types.ObjectId(userId),
				createdAt: { $gte: new Date(currDate.setUTCHours(0, 0, 0, 0)) },
			},
		},
		{
			$group: {
				_id: "$createdBy",
				amount: { $sum: "$price" },
				count: { $count: {} },
			},
		},
	]);

	res.status(StatusCodes.OK).json({ msg: "success", data: sales });
};

const getAllStocks = async (req, res) => {
	const userId = req.user.userId;

	const stocks = await Stock.aggregate([
		{
			$match: {
				createdBy: mongoose.Types.ObjectId(userId),
				status: "Not Sold",
			},
		},
		{
			$group: {
				_id: "$createdBy",
				amount: { $sum: "$price" },
				count: { $count: {} },
			},
		},
	]);

	res.status(StatusCodes.OK).json({ msg: "success", data: stocks });
};

module.exports = {
	getAllSales,
	getAllStocks,
};
