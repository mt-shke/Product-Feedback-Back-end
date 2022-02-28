const router = require("express").Router();
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");
const {
	getAllUsers,
	getSingleUser,
	updateUser,
	deleteUser,
	createDummyUser,
} = require("../controllers/user.controller");

router
	.route("/")
	.get([authenticateUser, authorizePermissions("admin")], getAllUsers)
	.post([authenticateUser, authorizePermissions("admin")], createDummyUser);

router
	.route("/:id")
	.get([authenticateUser, authorizePermissions("user")], getSingleUser)
	.patch([authenticateUser, authorizePermissions("user")], updateUser)
	.delete([authenticateUser, authorizePermissions("user")], deleteUser);

module.exports = router;
