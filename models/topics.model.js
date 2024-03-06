import mongoose, { Schema } from "mongoose";

const Topics = Schema({
  title: String,
  description: String,
  createdAt: Date,
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lectures",
    },
  ],
});

export default mongoose.model("Topics", Topics);
