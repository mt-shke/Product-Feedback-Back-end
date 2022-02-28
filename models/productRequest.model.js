const CustomError = require("../errors");

const mongoose = require("mongoose");

const ProductRequestSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provid valid title"],
			minlength: 6,
			maxlength: 60,
		},
		description: {
			type: String,
			required: [true, "Please provid valid title"],
			minlength: 6,
			maxlength: 600,
		},
		category: {
			type: String,
			enum: ["Enhancement", "Feature", "Bug", "UI", "UX"],
			required: [true, "Please provid a category"],
		},
		status: {
			type: String,
			enum: ["Suggestion", "Planned", "In-Progress", "Live"],
			required: [true, "Please provid a status"],
			default: "Suggestion",
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		upvoters: {
			type: [mongoose.Types.ObjectId],
			ref: "User",
			required: true,
			default: [],
		},
		numberOfUpvotes: {
			type: Number,
			required: true,
			default: 0,
		},
		comments: {
			type: [mongoose.Types.ObjectId],
			ref: "Comment",
			required: true,
			default: [],
		},
	},
	{ timestamps: true }
);

ProductRequestSchema.pre("remove", async function (next) {
	try {
		await this.model("Comment").deleteMany({ productRequest: this._id }, next).clone();
	} catch (error) {
		throw new CustomError.BadRequestError("Error deleting comment from product request");
	}
});

const ProductRequestModel = new mongoose.model("ProductRequest", ProductRequestSchema);

module.exports = ProductRequestModel;
