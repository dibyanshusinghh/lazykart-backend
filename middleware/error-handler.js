const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
	const errMsg = {};
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again later",
	};

	if (err.name === "ValidationError") {
		/*customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(",");*/
		customError.statusCode = 400;
		Object.values(err.errors).forEach((item) => {
			errMsg[item.path] = [item.message];
		});
		customError.msg = errMsg;
	}
	if (err.code && err.code === 11000) {
		errMsg[Object.keys(err.keyValue)] = [
			`Duplicate value entered for ${Object.keys(
				err.keyValue
			)} field, please choose another value`,
		];
		customError.msg = errMsg;
		customError.statusCode = 400;
		console.log(customError.msg);
	}
	if (err.name === "CastError") {
		customError.msg = `No item found with id : ${err.value}`;
		customError.statusCode = 404;
	}

	//return res.status(customError.statusCode).json({ data: customError.msg });
	return res.status(customError.statusCode).json({ data: customError.msg });
};

module.exports = errorHandlerMiddleware;
