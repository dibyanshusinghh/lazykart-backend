const express = require("express");

const router = express.Router();
const {
	getAllItems,
	getItem,
	updateItem,
	createItem,
	deleteItem,
} = require("../controllers/stock");

const {
	getAllOrders,
	getOrder,
	createOrder,
	updateOrder,
	deleteOrder,
} = require("../controllers/orders");

const { getAllSales, getAllStocks } = require("../controllers/dashboard");

router.route("/stock").post(createItem).get(getAllItems);
router.route("/stock/:id").get(getItem).delete(deleteItem).patch(updateItem);

router.route("/orders").post(createOrder).get(getAllOrders);
router
	.route("/orders/:id")
	.get(getOrder)
	.delete(deleteOrder)
	.patch(updateOrder);

router.route("/dashboard/getSales").get(getAllSales);
router.route("/dashboard/getStocks").get(getAllStocks);

module.exports = router;
