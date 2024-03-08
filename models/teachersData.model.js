import mongoose, { Schema } from "mongoose";

const teachersData = mongoose.Schema({
  userID: mongoose.Types.ObjectId,
  classesAssociated: [{ type: mongoose.Types.ObjectId, ref: "Classes" }],
});

export default mongoose.model("TeachersData" , teachersData);
