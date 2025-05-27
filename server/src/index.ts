import express from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import connectDB from "./config/db";
import userRouter from "./routes/userRoute";
import adminRouter from "./routes/adminRoute";
import { createServer } from "http";
import { initializeSocket } from "./services/socketService";

dotenv.config();
connectDB();

const app = express();

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;
const server = createServer(app);
initializeSocket(server);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
