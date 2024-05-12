import mongoose, { Schema } from "mongoose";

const Classes = Schema({
  title: String,
  description: String,
  status: Boolean,
  createdAt: Date,
  classCode: String,
  Subjects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Subjects",
    },
  ],
  people: [
    {
      type: mongoose.Types.ObjectId,
      ref: "studentData",
    },
  ],
  Requests: [{ type: mongoose.Types.ObjectId, ref: "Requests" }],
});

export default mongoose.model("Classes", Classes);
