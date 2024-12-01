const { express } = require("./modules.js");

const global = require("../../index.js");

const { getAccessToken } = require("./functions.js");

global.app.set("etag", false);

let cachedToken = null;
let tokenExpiration = 0;

const attachAccessToken = async (req, res, next) => {
	try {
		const now = Date.now();

		if (cachedToken && now < tokenExpiration) {
			req.token = cachedToken;
			next();
		} else {
			const token = await getAccessToken();
			cachedToken = token;
			tokenExpiration = now + 3600000;
			req.token = token;
			next();
		}
	} catch (error) {
		console.error("Error fetching access token:", error.message);
		res.status(500).json({ error: "Failed to fetch access token" });
	}
};

const errorHandler = async (err, req, res, next) => {
	const statusCode = err.statusCode || 500;

	return res.status(statusCode).json({
		message: err.message,
		status_code: statusCode,
		requestId: req.requestId,
	});
};

const notFoundHandler = (req, res, next) => {
	res.status(404).json({
		message: "Route does not exist.",
		status_code: 404,
	});

	res.end();
};

module.exports = {
	errorHandler,
	notFoundHandler,
	attachAccessToken,
};
