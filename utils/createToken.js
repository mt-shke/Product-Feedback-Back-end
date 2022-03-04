const createToken = (user) => {
	return {
		userId: user._id,
	};
};

module.exports = createToken;
