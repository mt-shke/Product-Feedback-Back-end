const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const UserModel = require("../models/user.model");
const crypto = require("crypto");

const getAllUsers = async (req, res) => {
	const users = await UserModel.find({});
	return res.status(StatusCodes.OK).json({ message: users });
};

const getSingleUser = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	if (id !== userId) {
		throw new CustomError.BadRequestError("You are not authorized");
	}
	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		// No user found with this email
		throw new CustomError.BadRequestError("Invalid request");
	}
	return res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	if (id !== userId) {
		throw new CustomError.BadRequestError("You are not authorized");
	}
	// need to create new params to update
	// const { email } = req.body; // params to update
	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		// No user found with this email
		throw new CustomError.BadRequestError("Invalid request");
	}

	// user.email = email;
	// user.save();
	return res.status(StatusCodes.OK).json({ message: "User updated" });
};

const deleteUser = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	// if (id !== !userId) {
	// 	throw new CustomError.BadRequestError("You are not authorized");
	// }
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please provide email and password");
	}

	const user = await UserModel.findOne({ _id: userId });
	if (!user) {
		// No user found with this email
		throw new CustomError.UnauthenticatedError("Invalid request");
	}

	const passwordMatch = await user.comparePassword(password);
	if (!passwordMatch) {
		throw new CustomError.UnauthenticatedError("Invalid credentials");
	}

	user.remove();
	return res.status(StatusCodes.OK).json({ message: "User deleted" });
};

const createDummyUser = async (req, res) => {
	const admin = req.user.role;
	if (!admin) {
		throw new CustomError.UnauthorizedError("You cannot access this route");
	}

	const newUsersPromise = req.body.map(async (user) => {
		return await UserModel.create({
			email: `${crypto.randomBytes(5).toString("hex")}@gmail.com`,
			password: crypto.randomBytes(30).toString("hex"),
			fullname: user.fullname,
			username: user.username,
			image: user.image,
			verificationToken: "",
			isVerified: true,
			verified: new Date(Date.now()),
			role: "user",
		});
	});

	const createdMultipleDummyUsers = await Promise.all([...newUsersPromise]);

	return res
		.status(StatusCodes.CREATED)
		.json({ success: true, message: "User Created!", createdMultipleDummyUsers });
};

module.exports = { getAllUsers, getSingleUser, updateUser, deleteUser, createDummyUser };

// const usersJson = [
// 	{"image": "/assets/user-images/image-zena.jpg",
// 		"fullname": "Zena Kelley",
// 		"username": "velvetround"
// 	},
// 	{"image": "/assets/user-images/image-suzanne.jpg",
// 		"fullname": "Suzanne Chang",
// 		"username": "upbeat1811"
// 	},
// 	{"image": "/assets/user-images/image-thomas.jpg",
// 		"fullname": "Thomas Hood",
// 		"username": "brawnybrave"
// 	},
// 	{"image": "/assets/user-images/image-elijah.jpg",
// 		"fullname": "Elijah Moss",
// 		"username": "hexagon.bestagon"
// 	},
// 	{"image": "/assets/user-images/image-james.jpg",
// 		"fullname": "James Skinner",
// 		"username": "hummingbird1"
// 	},
// 	{"image": "/assets/user-images/image-anne.jpg",
// 		"fullname": "Anne Valentine",
// 		"username": "annev1990"
// 	},
// 	{"image": "/assets/user-images/image-ryan.jpg",
// 		"fullname": "Ryan Welles",
// 		"username": "voyager.344"
// 	},
// 	{"image": "/assets/user-images/image-george.jpg",
// 		"fullname": "George Partridge",
// 		"username": "soccerviewer8"
// 	},
// 	{"image": "/assets/user-images/image-javier.jpg",
// 		"fullname": "Javier Pollard",
// 		"username": "warlikeduke"
// 	},
// 	{"image": "/assets/user-images/image-roxanne.jpg",
// 		"fullname": "Roxanne Travis",
// 		"username": "peppersprime32"
// 	},
// 	{"image": "/assets/user-images/image-victoria.jpg",
// 		"fullname": "Victoria Mejia",
// 		"username": "arlen_the_marlin"
// 	},

// 	{"image": "/assets/user-images/image-jackson.jpg",
// 		"fullname": "Jackson Barker",
// 		"username": "countryspirit"
// 	}
// ];
