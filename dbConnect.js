import mongoose from "mongoose";

export default async function connect() {
  await mongoose
    .connect(
      "mongodb+srv://parmarrisheet29:N7FGslS5PIPXvswD@cluster0.ix05l90.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((db) => {
      console.log("database connected...");
      return db;
    })
    .catch((err) => {
      console.log(err);
    });
}
