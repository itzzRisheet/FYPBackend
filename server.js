import express from "express";
import cors from "cors";
import router from "./routes/route.js";
import { connect } from "./dbConnect.js";
import http from "http";
import { Server } from "socket.io";
import requestsModel from "./models/requests.model.js";
import classesModel from "./models/classes.model.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

server.listen(4000, () => {
  console.log("Socket io listening on port 4000");
});

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

io.on("connection", (socket) => {
  socket.on("sendMsg", (data) => {
    socket.broadcast.emit("receiveMsg", data);
  });

  requestsModel.watch().on("change", (data) => {
    if (data.operationType === "delete") {
      socket.emit("requestDeleted", data.documentKey);
    }

    if (data.operationType === "insert") {
      socket.emit("requestCreate", data.fullDocument);
    }
  });

  classesModel.watch().on("change", (data) => {
    if (
      data.operationType === "update" &&
      data.updateDescription.updatedFields.people
    ) {
      socket.emit("studentAdded", data.documentKey);
    }
  });
});

connect().then((db) => {
  try {
    app.listen(PORT, () => {
      console.log(`app running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
});
