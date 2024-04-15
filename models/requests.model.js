import mongoose, { Schema } from "mongoose";

const requestsData = Schema({
  classID: {
    type: mongoose.Types.ObjectId,
  },
  studentID: {
    type: mongoose.Types.ObjectId,
  },
  status: {
    type: Boolean,
    default: false,
  },
  studentData: {
    name: String,
  },
});

export default mongoose.model("Requests", requestsData);
