import mongoose, { Schema } from "mongoose";

const studentData = mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, ref: "Users" },
  enrolls: {
    classes: [{ type: mongoose.Types.ObjectId, ref: "Classes" }],
    assignments: [{ type: mongoose.Types.ObjectId, ref: "assignments" }],
  },
  scores: {
    assignments: [
      {
        assignmentID: { type: mongoose.Types.ObjectId, ref: "assignments" },
        assignmentScore: Number,
      },
    ],
    quizes: [
      {
        quizID: { type: mongoose.Types.ObjectId, ref: "quizes" },
        quizScore: Number,
      },
    ],
    overallGrade: Number,
  },
  requests: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Requests",
    },
  ],
});

export default mongoose.model("studentData", studentData);
