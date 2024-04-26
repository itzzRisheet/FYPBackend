import { Schema } from "mongoose";
import mongoose from "mongoose";
 
const usersSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  createDate: Date,
  role: Boolean,
  usersData: {
    type: mongoose.Types.ObjectId,
    ref: "userRole",
  },
  userRole: {
    type: String,
    enum: ["TeachersData", "studentData"],
    required: true,
  },
});

export default mongoose.model("Users", usersSchema);
