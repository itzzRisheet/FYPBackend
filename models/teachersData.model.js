import mongoose from "mongoose";

const teachersData = mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, ref: "Users" },
  classesAssociated: [{ type: mongoose.Types.ObjectId, ref: "Classes" }],
});

export default mongoose.model("TeachersData", teachersData);
