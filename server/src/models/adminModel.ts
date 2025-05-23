import mongoose from "mongoose";
import { IAdmin } from "../domain/entities/admin";

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    name: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
