import { Router } from "express";
import * as controller from "../controllers/controller.js";

const router = Router();

//GET requests
router.route('/students/:sid/getVideos/').get(controller.getVideos);
router.route('/students/:sid/classes/').get(controller.getClasses);

//GET requests
//GET requests
//GET requests

export default router;
