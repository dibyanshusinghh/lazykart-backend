const Stock = require("../models/stock");
const Orders = require("../models/orders");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllItems = async (req, res) => {
	let Paginateditems = Stock.find({
		createdBy: req.user.userId,
		status: "Not Sold",
	}).sort("createdAt");

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	Paginateditems = Paginateditems.skip(skip).limit(limit);

	const items = await Paginateditems;

	let pageCount = await Stock.find({
		createdBy: req.user.userId,
		status: "Not Sold",
	}).count();

	pageCount = Math.ceil(pageCount / limit);

	res
		.status(StatusCodes.OK)
		.json({ data: { items: items, totalPage: pageCount } });
};

const getItem = async (req, res) => {
	const {
		user: { userId },
		params: { id: itemId },
	} = req;

	const item = await Stock.findOne({ itemId: itemId, createdBy: userId });
	if (!item) {
		throw new NotFoundError(`Item Out of Stock`);
	}
	res.status(StatusCodes.OK).json({ item });
};

const createItem = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const item = await Stock.create(req.body);
	res.status(StatusCodes.CREATED).send(`Item added to the stock`);
};

const updateItem = async (req, res) => {
	const {
		user: { userId },
		params: { id: itemId },
		body: { itemName, price },
	} = req;

	if (itemName === "" || price === "") {
		throw new BadRequestError(`Item name or price fields cannot be empty`);
	}
	const item = await Stock.updateOne(
		{ itemId: itemId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!item) {
		throw new NotFoundError(`No item with id ${itemId}`);
	}
	res.status(StatusCodes.OK).send(`item updated successfully`);
};

const deleteItem = async (req, res) => {
	const {
		user: { userId },
		params: { id: itemId },
	} = req;
	console.log(userId, itemId);
	//soft delete
	const item = await Stock.updateOne(
		{ itemId: itemId, createdBy: userId },
		{ $set: { status: "Sold" }, $currentDate: { lastModified: true } },
		{ new: true, runValidators: true }
	);

	if (!item) {
		throw new NotFoundError(`No item with id ${itemId}`);
	}
	/*const deletedItem = await Job.findOneAndDelete({
		_id: itemId,
		createdBy: userId,
	});
	if (!deletedItem) {
		throw new NotFoundError(`No Item with id ${itemId}`);
	}*/
	res.status(StatusCodes.OK).send(`Item with id ${itemId} deleted from stock`);
};

module.exports = {
	getAllItems,
	getItem,
	createItem,
	updateItem,
	deleteItem,
};
