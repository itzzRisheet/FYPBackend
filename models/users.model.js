import { Schema } from "mongoose";
import mongoose from "mongoose";

const usersSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  createDate: Date,
  role: Boolean,
  age: Number , 
  gender : String , 
  userRole: {
    type: String,
    enum: ["TeachersData", "studentData"],
    required: true,
  },
  usersData: {
    type: mongoose.Types.ObjectId,
    ref: "userRole",
  },
});

export default mongoose.model("Users", usersSchema);
