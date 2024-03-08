import { Router } from "express";
import * as controller from "../controllers/controller.js";

const router = Router();

//GET requests
router.route("/login").post(controller.login);


router.route("/createuser").post(controller.createUser);
router.route("/getusers").get(controller.getusers);
router.route("/getuser/:id/:role").get(controller.getUser);
router
  .route("/students/:sid/getclassNames")
  .get(controller.getClassNames_students);
router.route("/teachers/:tid/getclassNames").get(controller.getClassNames_teachers);


router.route("/students/:sid/getVideos/").get(controller.getVideos);
router.route("/students/:sid/joinclass/").post(controller.joinClass);
router
  .route("/classes/getclass/:classID")
  .get(controller.getClassData);
router
  .route("/subjects/:subjectID")
  .get(controller.getSubjectData);
router
  .route(
    "/topics/:topicID"
  )
  .get(controller.getTopicData);
router
  .route(
    "/lectures/:lecID"
  )
  .get(controller.getLectureData);
  router.route("/students/:sid/attemptQuiz").post(controller.attempteQuiz);


//temporary routes



router.route("/teachers/:tid/createclass").post(controller.createClass);


router.route("/teachers/:tid/createsubject").post(controller.createSubject);
router.route("/teachers/:tid/createtopic").post(controller.createTopic);
router.route("/teachers/:tid/createlecture").post(controller.createLecture);
router.route("/teachers/:tid/addQuiz").post(controller.addQuiz);
router.route("/getQuizData").post(controller.getQuizData);

export default router;
