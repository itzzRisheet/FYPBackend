import mongoose, { Schema } from "mongoose";

const Topics = Schema({
  title: String,
  description: String,
  createdAt: Date,
  lectureCompleteStatus: {
    type : Number ,
    default : 0
  },
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lectures",
    },
  ],
  quizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizes",
    },
  ],
});

export default mongoose.model("Topics", Topics);
