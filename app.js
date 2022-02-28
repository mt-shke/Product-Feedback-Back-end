require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Db
const connectDB = require("./db/connectDB");

// Extra package Import
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimiter = require("express-rate-limit");
// const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Routes Import
const authRouter = require("./routes/auth.routes");
const usersRouter = require("./routes/users.routes");
const productRequestsRouter = require("./routes/product-requests.routes");

// Middleware Import
const NotFoundMiddleware = require("./middleware/not-found");
const ErrorHandlerMiddleware = require("./middleware/error-handler");

// app.use
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 500,
	})
);
app.use(helmet());
app.use(xss());
// CORS
// app.use(cors());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: "https://fm-pfeedback.netlify.app", credentials: true }));
// app.use(
// 	cors({
// 		origin: "https://fm-pfeedback.netlify.app",
// 		preflightContinue: true,
// 		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 		credentials: true,
// 	})
// );
app.use(mongoSanitize());

app.use(express.json());
// app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));

// Routes
app.get("/", (req, res) => {
	res.send("Hello world, welcome home");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/product-requests", productRequestsRouter);

// Middleware
app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

// Server start
const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => console.log("Server is listening"));
	} catch (error) {}
};

start();
