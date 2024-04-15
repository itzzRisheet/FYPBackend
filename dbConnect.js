import mongoose  from "mongoose";
import { config } from "dotenv";

config();




export  async function connect() {
  await mongoose
    .connect(process.env.MONGOURI)
    .then((db) => {
      console.log("database connected...");
      return db;
    })
    .catch((err) => {
      console.log(err);
      throw err
    });
}
