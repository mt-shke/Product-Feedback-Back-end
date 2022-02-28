const data = require("../data.json");
const replies = require("../replies.json");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const CommentModel = require("../models/comment.model");
const UserModel = require("../models/user.model");

// Comments
const postComment = async (req, res) => {
	const { content, productRequest, comment } = req.body;
	if (!content && !productRequest) {
		throw new CustomError.BadRequestError("Content and ProductRequestId missing");
	}
	if (comment) {
		// if comment this is a response to a comment
		const newComment = await CommentModel.create({
			content,
			user: req.user.userId,
			productRequest: productRequest,
			comment: comment,
		});
		return res.status(StatusCodes.CREATED).json({ success: true, message: "Comment created!", newComment });
	}

	// if !comment this is a direct response to a productRequest

	const newComment = await CommentModel.create({
		content,
		user: req.user.userId,
		productRequest: productRequest,
	});

	return res.status(StatusCodes.CREATED).json({ success: true, message: "Comment created!", newComment });
};

const updateComment = async (req, res) => {
	const { commentId } = req.params;
	const { content } = req.body;
	const comment = await CommentModel.findOne({ _id: { commentId } });
	if (!comment) {
		throw new CustomError.BadRequestError("Comment not found");
	}
	comment.content = content;
	comment.update();
	return res.status(StatusCodes.OK).json({ success: true, message: "Comment created!" });
};

const deleteComment = async (req, res) => {
	const { commentId } = req.params;
	const comment = await CommentModel.findOne({ _id: commentId });
	if (!comment) {
		throw new CustomError.BadRequestError("Comment not found");
	}
	if (req.user.userId === comment.user.toString() || req.user.role === "admin") {
		comment.remove();
		return res.status(StatusCodes.OK).json({ success: true, message: "Comment deleted!" });
	}
	throw new CustomError.UnauthorizedError("You are not authorized");
};

// DB
const createMultipleDummyComments = async (req, res) => {
	const admin = req.user.role;
	if (!admin) {
		throw new CustomError.UnauthorizedError("You cannot access this route");
	}

	const commentsArray = data.map((dat) => dat.comments).flat(Infinity);
	const commentsPromise = commentsArray.map(async (com) => {
		return await createComment(com);
	});

	const createdComments = await Promise.all([...commentsPromise]);

	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, message: "Comments Created!", createdComments });
};

const createMultipleReplies = async (req, res) => {
	const admin = req.user.role;
	if (!admin) {
		throw new CustomError.UnauthorizedError("You cannot access this route");
	}

	const repliesArray = replies.map(async (rep) => {
		return await createReplies(rep);
	});
	const createdComments = await Promise.all([...repliesArray]);

	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, message: "Comments Created!", createdComments });
};

const createComment = async (comment) => {
	const user = await UserModel.findOne({ username: comment.user.username });
	if (!user) {
		throw new CustomError.BadRequestError("No user found");
	}
	return await CommentModel.create({
		content: comment.content,
		user: user._id,
		productRequest: comment.requestId,
	});
};

const createReplies = async (comment) => {
	const user = await UserModel.findOne({ username: comment.user.username });
	if (!user) {
		throw new CustomError.BadRequestError("No user found");
	}
	return await CommentModel.create({
		user: user._id,
		productRequest: comment.productRequest,
		content: comment.content,
		comment: comment.comment,
	});
};

module.exports = {
	postComment,
	createMultipleDummyComments,
	deleteComment,
	updateComment,
	createMultipleReplies,
};
