const NotFoundMiddleware = (req, res) => {
	return res.status(400).send("Route not found");
};

module.exports = NotFoundMiddleware;
