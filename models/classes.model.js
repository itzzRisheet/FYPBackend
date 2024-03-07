import mongoose, { Schema } from "mongoose";

const Classes = Schema({
  title: String,
  description: String,
  status: Boolean,
  createdAt: Date,
  classCode: Number,
  Subjects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Subjects",
    },
  ],
  people: [
    {
      type: mongoose.Types.ObjectId,
      ref: "peopleType",
    },
  ],
  peopleType: {
    type: String,
    enum: ["TeachersData", "studentData"],
  },
});

export default mongoose.model("Classes", Classes);
