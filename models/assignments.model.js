import mongoose, { Schema } from "mongoose";

const assignmentsSchema = Schema({
  title: String,
  description: String,
  dueDate: Date,
  attachments: String,
  points: Number,
});

mongoose.model("assignments", assignmentsSchema);
