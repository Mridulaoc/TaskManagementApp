import mongoose from "mongoose";
import { IUser } from "../../../domain/entities/User";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
