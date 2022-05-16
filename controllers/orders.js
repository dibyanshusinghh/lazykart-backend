const Stock = require("../models/stock");
const Orders = require("../models/orders");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllOrders = async (req, res) => {
	let PaginatedOrders = Orders.find({ createdBy: req.user.userId }).sort(
		"createdAt"
	);

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	PaginatedOrders = PaginatedOrders.skip(skip).limit(limit);

	const orders = await PaginatedOrders;

	let pageCount = await Orders.find({
		createdBy: req.user.userId,
	}).count();

	pageCount = Math.ceil(pageCount / limit);

	res
		.status(StatusCodes.OK)
		.json({ data: { items: orders, totalPage: pageCount } });
};

const getOrder = async (req, res) => {
	const {
		user: { userId },
		params: { id: itemId },
	} = req;

	const order = await Orders.findOne({ itemId: itemId, createdBy: userId });
	if (!order) {
		throw new NotFoundError(`No Order with id ${itemId}`);
	}
	res.status(StatusCodes.OK).json({ data: order });
};

const createOrder = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const {
		user: { userId },
		body: { itemId },
	} = req;
	const item = await Stock.findOne({
		itemId: itemId,
		createdBy: userId,
		status: "Not Sold",
	});
	console.log(item);
	if (!item) {
		throw new NotFoundError(`Item Out of Stock`);
	}
	if (!(item.itemName === req.body.itemName)) {
		throw new BadRequestError(
			`Item Id doesn't match with the item in the stock`
		);
	}
	const order = await Orders.create(req.body);

	const stockItem = await Stock.findOneAndUpdate(
		{ itemId: itemId, createdBy: userId },
		{ $set: { status: "Sold" }, $currentDate: { lastModified: true } },
		{ new: true, runValidators: true }
	);

	res.status(StatusCodes.CREATED).send(`Order added Successfully`);
};

const updateOrder = async (req, res) => {
	const {
		user: { userId },
		params: { id: itemId },
		body: { itemName, price },
	} = req;

	if (itemName === "" || price === "") {
		throw new BadRequestError(`Item name or price fields cannot be empty`);
	}
	const order = await Orders.findOneAndUpdate(
		{ itemId: itemId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!order) {
		throw new NotFoundError(`No order with item id ${itemId} found`);
	}
	res.status(StatusCodes.OK).send(`Order updated successfully`);
};

const deleteOrder = async (req, res) => {
	const {
		user: { userId },
		params: { id: itemId },
	} = req;
	//console.log(userId, itemId);

	const order = await Orders.findOneAndDelete({
		itemId: itemId,
		createdBy: userId,
	});
	//console.log(order);
	if (!order) {
		throw new NotFoundError(`No Item with id ${itemId} found`);
	}
	// reversing the status in the stock
	if (!(order.status === "Delivered")) {
		const item = await Stock.updateOne(
			{ itemId: itemId, createdBy: userId },
			{ $set: { status: "Not Sold" }, $currentDate: { lastModified: true } },
			{ new: true, runValidators: true }
		);
	}
	res.status(StatusCodes.OK).send(`Item with id ${itemId} deleted from Orders`);
};

module.exports = {
	getAllOrders,
	getOrder,
	updateOrder,
	createOrder,
	deleteOrder,
};
