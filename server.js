import express from "express";
import cors from "cors";
import router from "./routes/route.js";
import connect from "./dbConnect.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);


// http get request
app.get("/", (req, res) => {
  res.status(201).json({
    msg: "running perfectly",
  });
});

const PORT = 8080 || process.env.PORT;

connect().then(() => {
  try {
    app.listen(PORT, () => {
      console.log(`app running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
});
