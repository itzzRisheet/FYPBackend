import mongoose, { Schema } from "mongoose";

const assignments = Schema({
  title: String,
  description: String,
  dueDate: Date,
  attachments : String ,
});
