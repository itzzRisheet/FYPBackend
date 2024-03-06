import mongoose, { Schema } from "mongoose";

const studentData = mongoose.Schema({
  role : String , 
  enrolls : {
    clases : [String],
    assignments : [String]
  },
  scroes : {
    assignments : {
        assignmentID : Number,
    },
    quizes : {
        quizID : Number,    
    },
    overallGrade : Number,
  }
});

export default mongoose.model("studentData",studentData);
