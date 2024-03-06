import { Schema } from "mongoose";
import mongoose from "mongoose";

const usersSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  createDate: Date,
  role: Boolean,
  usersData: {
    type: mongoose.Types.ObjectId,
    ref: "studentData",
  } || {
    type: mongoose.Types.ObjectId,
    ref: "TeachersData",
  },
});

export default mongoose.model("Users", usersSchema);
