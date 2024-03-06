import mongoose, { Schema } from "mongoose";

const Lectures = Schema({
  title: String,
  description: String,
  lec_link: String,
});

export default mongoose.model("Lectures", Lectures);
