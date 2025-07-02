import express, {
  json,
  Request,
  Response,
  NextFunction,
  urlencoded,
} from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import productsRoute from "./routes/productsRoutes";
import usersRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import addressesRoutes from "./routes/addressesRoutes";
import cartsRoutes from "./routes/cartsRoutes";
import { ApiError } from "./utils/apiError";
import morgan from "morgan";
import path from "path";

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

// Routes
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/addresses", addressesRoutes);
app.use("/api/v1/carts", cartsRoutes);

// Error Route
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Error Handler
app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`server is ready on port ${port}`);
});
