import mongoose, { Schema } from "mongoose";

const teachersData = mongoose.Schema({
    classesAssociated : [String]
});

export default mongoose.model("TeachersData" , teachersData);
