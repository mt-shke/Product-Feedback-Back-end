const createToken = (user) => {
	return {
		email: user.email,
		username: user.username,
		userId: user._id,
		role: user.role,
	};
};

module.exports = createToken;
