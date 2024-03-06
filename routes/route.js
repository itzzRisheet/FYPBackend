import { Router } from "express";
import * as controller from "../controllers/controller.js";

const router = Router();

//GET requests
router.route("/students/:sid/getVideos/").get(controller.getVideos);
router.route("/students/:sid/classes/:classID").get(controller.getClasses);

//temporary routes
router.route("/createclass").post(controller.createClass);
router.route("/createsubject").post(controller.createSubject);
router.route("/createtopic").post(controller.createTopic);
router.route("/createlecture").post(controller.createLecture);

export default router;
