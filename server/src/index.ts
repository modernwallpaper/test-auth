import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.set('trust proxy', true);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

