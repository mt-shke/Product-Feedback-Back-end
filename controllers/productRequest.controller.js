const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const ProductRequestModel = require("../models/productRequest.model");

const getAllProductRequests = async (req, res) => {
	const requests = await ProductRequestModel.find({}).populate([
		{
			path: "comments",
			model: "Comment",
			populate: {
				path: "user",
				model: "User",
				select: ["_id", "email", "fullname", "username", "image"],
			},
		},
	]);
	return res.status(StatusCodes.OK).json({ requests });
};

const createProductRequest = async (req, res) => {
	const { category, title, description } = req.body;
	const user = req.user.userId;
	if (!title || !category || !description) {
		throw new CustomError.BadRequestError("A field is missing");
	}
	if (!user) {
		throw new CustomError.UnauthenticatedError("Something wrong happened, please try again later");
	}
	const request = await ProductRequestModel.create({ category, title, description, user });

	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, message: "Product request created!", request });
};

const getSingleProductRequest = async (req, res) => {
	const { productRequestId } = req.params;
	const request = await ProductRequestModel.findOne({ _id: productRequestId }).populate([
		{
			path: "comments",
			model: "Comment",
			populate: {
				path: "user",
				model: "User",
				select: ["_id", "email", "fullname", "username", "image"],
			},
		},
	]);

	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}
	return res.status(StatusCodes.OK).json({ success: true, request });
};

const updateProductRequest = async (req, res) => {
	const { productRequestId } = req.params;
	const { category, title, status, description } = req.body;
	const request = await ProductRequestModel.findOneAndUpdate(
		{ _id: productRequestId },
		{ category: category, title: title, status: status ? status : this.status, description: description },
		{ new: true }
	);
	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}

	return res.status(StatusCodes.OK).json({ succes: true, message: "Updated!", request: request });
};

const deleteProductRequest = async (req, res) => {
	const { productRequestId } = req.params;
	const userId = req.user.userId;
	const request = await ProductRequestModel.findOne({ _id: productRequestId });
	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}

	const usersMatch = request.user.toString() === userId;
	if (usersMatch || req.user.role === "admin") {
		await request.remove();
		return res.status(StatusCodes.OK).json({ success: true, message: "Deleted!" });
	}
	throw new CustomError.UnauthorizedError("You are not authorized");
};

const setUpvote = async (req, res) => {
	const { productRequestId } = req.params;
	const { userId } = req.user;
	const request = await ProductRequestModel.findOne({ _id: productRequestId });
	if (!request) {
		throw new CustomError.BadRequestError("Product request not found");
	}

	const userAlreadyVoted = request.upvoters.find((user) => user.toString() === userId.toString());
	if (userAlreadyVoted) {
		const filtered = request.upvoters.filter((user) => user.toString() !== userId.toString());
		request.upvoters = filtered;
	}
	if (!userAlreadyVoted) {
		request.upvoters = [...request.upvoters, userId];
	}
	request.save();
	return res
		.status(StatusCodes.OK)
		.json({ succes: true, message: "Set upvote success", upvote: request.upvoters });
};

// Dummy db
const createMultipleDummyRequests = async (req, res) => {
	const admin = req.user.role;
	if (!admin) {
		throw new CustomError.UnauthorizedError("You cannot access this route");
	}

	const requestsPromise = req.body.map(async (request) => {
		return await ProductRequestModel.create({
			user: req.user.userId,
			title: request.title,
			category: request.category,
			description: request.description,
			status: request.status,
			numberOfUpvotes: request.numberOfUpvotes,
			comments: request.comments,
		});
	});

	const createdRequests = await Promise.all([...requestsPromise]);

	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, message: "Requests Created!", createdRequests });
};

module.exports = {
	getAllProductRequests,
	getSingleProductRequest,
	createProductRequest,
	updateProductRequest,
	deleteProductRequest,
	createMultipleDummyRequests,
	setUpvote,
};
