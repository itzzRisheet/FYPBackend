import mongoose, { Schema } from "mongoose";

const teachersData = mongoose.Schema({
    role : String,
    classesAssociated : [String]
});

export default mongoose.model("TeachersData" , teachersData);
