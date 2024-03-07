import mongoose, { Schema } from "mongoose";

const teachersData = mongoose.Schema({
    userID : mongoose.Types.ObjectId,
    classesAssociated : [String]
});

export default mongoose.model("TeachersData" , teachersData);
