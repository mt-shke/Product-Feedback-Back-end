const createToken = (user) => {
	return {
		email: user.email,
		username: user.username,
		userId: user._id,
	};
};

module.exports = createToken;
