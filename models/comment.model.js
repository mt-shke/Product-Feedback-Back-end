const CustomError = require("../errors");
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: [true, "Please provide context"],
			maxlength: 400,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// each comments has productRequest
		productRequest: {
			type: mongoose.Types.ObjectId,
			ref: "ProductRequest",
			required: true,
		},
		// only comments which repond to another comment has comment field aka parent
		comment: {
			type: mongoose.Types.ObjectId,
			ref: "Comment",
			required: false,
		},
	},
	{ timestamps: true }
);

CommentSchema.pre("save", async function (next) {
	try {
		if (this.comment) {
			await this.model("Comment")
				.findOneAndUpdate({ _id: this.comment }, { $addToSet: { comments: this._id } }, next)
				.clone();
		}

		await this.model("ProductRequest")
			.findOneAndUpdate({ _id: this.productRequest }, { $addToSet: { comments: this._id } }, next)
			.clone();
	} catch (error) {
		throw new CustomError.BadRequestError("Error while saving comments");
	}
});

CommentSchema.pre("remove", async function (next) {
	try {
		await this.model("ProductRequest")
			.findOneAndUpdate({ _id: this.productRequest }, { $pull: { comments: this._id } }, next)
			.clone();
	} catch (error) {
		throw new CustomError.BadRequestError("Error while removing comments");
	}
});

const CommentModel = new mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
