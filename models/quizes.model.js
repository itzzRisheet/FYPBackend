import mongoose, { Schema } from "mongoose";

const quizeSchema = Schema({
  questions: [
    {
      _id:false,
      index: Number,
      question: String,
      options: {
        a: String,
        b: String,
        c: String,
        d: String,
      },
      answer: {
        type: String,
        enum: ["a", "b", "c", "d"],
        required: true,
      },
    },
  ],
});

export default mongoose.model("quizes", quizeSchema);
