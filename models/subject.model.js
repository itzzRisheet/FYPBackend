import mongoose, { Schema, mongo } from "mongoose";

const Subjects = Schema({
  title: String,
  description: String,
  createdAT: Date,
  topics: [{ type: mongoose.Types.ObjectId, ref: "Topics" }],
});

export default mongoose.model("Subjects", Subjects);
