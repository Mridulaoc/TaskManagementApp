import express from "express";
import { adminLogin, adminSignUp } from "../app/controller/adminController";

const adminRouter = express.Router();

adminRouter.post("/signup", adminSignUp);
adminRouter.post("/login", adminLogin);

export default adminRouter;
