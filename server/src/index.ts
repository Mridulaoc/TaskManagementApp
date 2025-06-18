import express from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import { createServer } from "http";
import { initializeSocket } from "./infrastructure/services/socketService";
import adminRouter from "./presentation/routes/adminRoute";
import connectDB from "./infrastructure/database/connectDB";
import userRouter from "./presentation/routes/userRoute";
import { taskRouter, adminTaskRouter } from "./presentation/routes/taskRoute";

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
app.use("/task", taskRouter);
app.use("/admin/task", adminTaskRouter);

const PORT = process.env.PORT || 3001;
const server = createServer(app);
initializeSocket(server);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
