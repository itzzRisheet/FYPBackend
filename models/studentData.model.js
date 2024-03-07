import mongoose, { Schema } from "mongoose";

const studentData = mongoose.Schema({
  userID: mongoose.Types.ObjectId,
  enrolls: {
    classes: [String],
    assignments: [String],
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
});

export default mongoose.model("studentData", studentData);
