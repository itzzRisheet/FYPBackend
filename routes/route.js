import { Router } from "express";
import * as controller from "../controllers/controller.js";

const router = Router();

//GET requests
router.route("/getusers").get(controller.getusers);
router.route("/getuser/:id/:role").get(controller.getUser);
router.route("/students/:sid/getclasses").get(controller.getClassNames);

router.route("/students/:sid/getVideos/").get(controller.getVideos);
router.route("/students/:sid/joinclass/").post(controller.joinClass)
router
  .route("/students/:sid/classes/getclass/:classID")
  .get(controller.getClassData);
router
  .route("/students/:sid/classes/getclass/:classID/subjects/:subjectID")
  .get(controller.getSubjectData);
router
  .route(
    "/students/:sid/classes/getclass/:classID/subjects/:subjectID/topics/:topicID"
  )
  .get(controller.getTopicData);
router
  .route(
    "/students/:sid/classes/getclass/:classID/subjects/:subjectID/topics/:topicID/lectures/:lecID"
  )
  .get(controller.getLectureData);
router
  .route("/students/:sid/topics/:topicID/quizes/:quizID")
  .get(controller.getQuizData);

//temporary routes
router.route("/createuser").post(controller.createUser);
router.route("/createclass").post(controller.createClass);
router.route("/createsubject").post(controller.createSubject);
router.route("/createtopic").post(controller.createTopic);
router.route("/createlecture").post(controller.createLecture);
router.route("/addQuiz").post(controller.addQuiz);
router.route("/getQuizData").post(controller.getQuizData);

export default router;
