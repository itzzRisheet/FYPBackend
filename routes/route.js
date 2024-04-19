import { Router } from "express";
import * as controller from "../controllers/controller.js";

const router = Router();

// Login/signup route
router.route("/login").post(controller.login);
router.route("/signup").post(controller.createUser);

/* -------------------General Routes----------------------- */
//General User routes
router.route("/getusers").get(controller.getusers);
router.route("/getuser/:id/:role").get(controller.getUser);
//General Class routes
router.route("/classes/getclass/:classID").get(controller.getClassData);
router.route("/classes/:classID/people").get(controller.getPeopleData);
router.route("/subjects/:subjectID").get(controller.getSubjectData);
router.route("/topics/:topicID").get(controller.getTopicData);
router.route("/lectures/:lecID").get(controller.getLectureData);
router.route("/getQuizData").post(controller.getQuizData);
router.route("/cancelRequest").post(controller.cancelRequest);
router.route("/acceptRequest").post(controller.acceptRequest);
router.route("/subjects/:subjectID/addTopics").post(controller.addTopics);

/*--------------------Student Routes-------------------------*/
router
  .route("/students/:sid/getclassNames")
  .get(controller.getClassNames_students);
router.route("/students/:sid/getVideos/").get(controller.getVideos);
router.route("/students/:sid/attemptQuiz").post(controller.attempteQuiz);
router.route("/students/:sid/joinClass/").post(controller.joinClass);

/*--------------------Teacher Routes-------------------------*/

router
  .route("/teachers/:tid/getclassNames")
  .get(controller.getClassNames_teachers);
router.route("/teachers/:tid/createclass").post(controller.createClass);

router.route("/teachers/:tid/createsubject").post(controller.createSubject);
router
  .route("/teachers/:tid/createMultipleSubjects")
  .post(controller.createMultipleSubject);

router.route("/teachers/:tid/createtopic").post(controller.createTopic);
router.route("/teachers/:tid/createlecture").post(controller.createLecture);
router.route("/teachers/:tid/addQuiz").post(controller.addQuiz);
router.route("/classes/:classID/addCode").post(controller.addClassCode);

export default router;
