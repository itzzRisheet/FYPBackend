import mongoose, { Schema } from "mongoose";

const Lectures = Schema({
  title: String,
  description: String,
  lec_link: String,
  Quiz: [
    {
      type: mongoose.Types.ObjectId,
      ref: "quizes",
    },
  ],
  resources: [
    {
      fileName: String,
      data: Buffer,
      contentType: String,
    },
  ],
});

export default mongoose.model("Lectures", Lectures);
