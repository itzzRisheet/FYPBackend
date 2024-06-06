import axios from "axios";
import classesModel from "../models/classes.model.js";
import lecturesModel from "../models/lectures.model.js";
import quizesModel from "../models/quizes.model.js";
import studentDataModel from "../models/studentData.model.js";
import subjectModel from "../models/subject.model.js";
import teachersDataModel from "../models/teachersData.model.js";
import teachersDataMode from "../models/teachersData.model.js";
import topicsModel from "../models/topics.model.js";
import usersModel from "../models/users.model.js";
import Users from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import requestsModel from "../models/requests.model.js";
import { populate } from "dotenv";

export async function login(req, res) {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).send({
      msg: "Enter your email and password!!!",
    });
  }
  // let surveyGiven;
  await usersModel
    .findOne({ email })
    .then(async (user) => {
      if (user) {
        const sid = user.usersData;
        const student = await studentDataModel.findOne({ _id: sid });
        // surveyGiven = student.surveyGiven;
      }
      await bcrypt
        .compare(password, user.password)
        .then((match) => {
          console.log(match);
          if (match) {
            const token = jwt.sign(
              {
                userID: user._id,
                roleID: user.usersData,
                email: user.email,
                role: user.role,
                age: user.age,
                gender: user.gender,
                // surveyGiven,
              },
              process.env.JWTSECRET,
              { expiresIn: "5h" }
            );

            return res.status(200).send({
              msg: "Logged In successfully",
              token,
            });
          } else {
            return res.status(404).send({
              msg: "Incorrect password",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            msg: "wrong password",
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        msg: "User not found",
        error: err.message,
      });
    });
}
export async function submitSurvey(req, res) {
  const { sid } = req.params;

  const updateStatus = studentDataModel.findOneAndUpdate(
    { _id: sid },
    {
      $set: {
        surveyGiven: true,
      },
    }
  );

  console.log(updateStatus);
}

export async function createUser(req, res) {
  const { fname, lname, email, role, password, age, gender } = req.body;
  console.log(req.body);

  if (role) {
    var usersData = studentDataModel({});
  } else {
    var usersData = teachersDataModel({});
  }

  const userPromise = new Promise(async (resolve, reject) => {
    try {
      const existEmail = await usersModel.findOne({ email });

      if (existEmail) reject("Email already registered!!!");
      resolve();
    } catch (error) {
      reject(error.message);
    }
  });

  userPromise
    .then(() => {
      if (!password) {
        return res.status(500).send({
          msg: "Didn't get the password",
        });
      }

      bcrypt.hash(password, 12).then(async (hashedpassword) => {
        const user = new usersModel({
          fname,
          lname,
          email,
          password: hashedpassword,
          createDate: new Date(),
          role,
          userRole: role ? "studentData" : "TeachersData",
          usersData: usersData._id,
          age,
          gender,
        });

        try {
          const savedUser = await user.save();

          // Add the userID field to usersData
          usersData.userID = savedUser._id;

          await usersData.save();

          const token = jwt.sign(
            {
              userID: savedUser._id,
              roleID: savedUser.usersData,
              email: savedUser.email,
              role: savedUser.role,
              surveyGiven: false,
              age: savedUser.age,
              gender: savedUser.gender,
            },
            process.env.JWTSECRET,
            { expiresIn: "5h" }
          );

          return res.status(200).send({
            msg: "User created successfully",
            token,
          });
        } catch (error) {
          console.log(error);
          return res.status(500).send({
            msg: "Error creating user",
            error,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        msg: err,
        error: err,
      });
    });
}

export async function createStudent(res, userID) {
  const student = new studentDataModel({});

  await usersModel
    .updateOne(
      { _id: userID },
      {
        $set: {
          usersData: student._id,
        },
      }
    )
    .then(async () => {
      await student
        .save()
        .then((s) => {
          console.log("Student created successfully");
          return s._id;
        })
        .catch((error) => {
          return res.status(500).send({
            msg: "Error creating student",
            error,
          });
        });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Couldn't add student to usersData",
        error,
      });
    });
}

export async function createTeacher(res, userID) {
  const teacher = teachersDataMode({});
  let teacherID;

  await usersModel
    .updateOne(
      { _id: userID },
      {
        $set: {
          usersData: teacher._id,
        },
      }
    )
    .then(() => {
      teacher
        .save()
        .then((t) => {
          console.log("Teacher created successfully");
          return t._id;
        })
        .catch((error) => {
          return res.status(500).send({
            msg: "Can not add teacher",
            error,
          });
        });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "can't add teacher to users",
        error,
      });
    });
}

export async function getUser(req, res) {
  const { id, role } = req.params;

  if (parseInt(role)) return getStudent(res, id);
  return getTeacher(res, id);
}

async function getStudent(res, id) {
  console.log("student called");

  await studentDataModel
    .find({ _id: id })
    .populate("userID")
    .then((data) => {
      if (data) {
        return res.status(200).send({
          msg: "user found!!",
          data,
        });
      } else {
        return res.status(404).send({
          msg: "Invalid student ID",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        msg: "User not found",
        error,
      });
    });
}

async function getTeacher(res, id) {
  console.log("teacher called");
  await teachersDataModel
    .find({ _id: id })
    .then((data) => {
      if (data) {
        return res.status(200).send({
          msg: "user found!!",
          data,
        });
      } else {
        return res.status(404).send({
          msg: "Invalid student ID",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "User not found",
        error,
      });
    });
}

export function getVideos(req, res) {
  try {
    console.log(req.params);
    return res.status(200).send({
      videoIDs: [],
    });
  } catch (error) {
    return res.status(500).send({
      error,
      msg: "can't get videos",
    });
  }
}

export async function getClassNames_students(req, res) {
  const { sid } = req.params;

  studentDataModel
    .find({ _id: sid })
    .populate({ path: "enrolls", populate: { path: "classes" } })
    .then((data) => {
      if (data) {
        var classnames = [];
        data.map((d) => {
          d.enrolls.classes.map((cls) => {
            classnames.push({
              title: cls.title,
              classID: cls._id,
              desc: cls.description,
              createdAt: cls.createdAt,
            });
          });
        });

        // const classnames = data.map((d) => {
        //   return d.enrolls.classes;
        // });
        return res.status(200).send({
          msg: "classes retrieved successfully",
          data: classnames,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving classes",
        error,
      });
    });
}

export async function getClassNames_teachers(req, res) {
  const { tid } = req.params;

  teachersDataModel
    .find({ _id: tid })
    .populate({ path: "classesAssociated" })
    .then((data) => {
      if (data) {
        var classnames = [];
        data.map((d) => {
          d.classesAssociated.map((cls) => {
            classnames.push({
              title: cls.title,
              classID: cls._id,
              desc: cls.description,
              createdAt: cls.createdAt,
            });
          });
        });

        return res.status(200).send({
          msg: "classes retrieved successfully",
          data: classnames,
        });
      }
      return res.status(404).send({
        msg: "invalid input data",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving classes",
        error,
      });
    });
}

export function getClassData(req, res) {
  const { classID } = req.params;

  classesModel
    .findOne({ _id: classID })
    .populate({
      path: "Subjects",
      populate: {
        path: "topics",
        populate: {
          path: "lectures",
        },
      },
    })
    .then((data) => {
      if (data) {
        return res.status(200).send({
          msg: "class retrieved successfully",
          data: data,
        });
      }
      return res.status(404).send({
        msg: "invalid classID or class doesn't exist",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        msg: "couldn't find class",
        error,
      });
    });
}

export function getSubjectData(req, res) {
  const { subjectID } = req.params;
  console.log(req.params);

  subjectModel
    .findOne({ _id: subjectID })
    .populate({
      path: "topics",
      populate: {
        path: "lectures",
      },
    })
    .then((sub) => {
      if (sub) {
        return res.status(200).send({
          msg: "Subject retrieved successfully!!",
          data: sub,
        });
      }
      return res.status(404).send({
        msg: "invalid subject ID",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        msg: "Error retrieving subject",
        error,
      });
    });
}

export async function getTopicData(req, res) {
  const { topicID } = req.params;
  console.log("topicID : ", topicID);

  await topicsModel
    .findOne({ _id: topicID })
    .then((data) => {
      if (data) {
        return res.status(200).send({
          msg: "Topic data received!!!",
          data,
        });
      }
      return res.status(404).send({
        msg: "invalid topic ID",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error receiving topic data",
        error,
      });
    });
}

export async function getLectureData(req, res) {
  const { lecID } = req.params;

  await lecturesModel
    .findOne({ _id: lecID })
    .then((data) => {
      if (data) {
        return res.status(200).send({
          msg: "Lecture data received!!!",
          data,
        });
      }
      return res.status(404).send({
        msg: "Invalid lecture ID",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        msg: "Can't find Lecture data",
        err,
      });
    });
}

export async function getPeopleData(req, res) {
  const { classID } = req.params;

  classesModel
    .findOne({
      _id: classID,
    })
    .populate("Requests")
    .populate({
      path: "people",
      populate: {
        path: "userID",
      },
    })
    .then((data) => {
      const { people, Requests } = data;
      const names = [];

      data.people.map((people) => {
        let fullname = people.userID.fname + " " + people.userID.lname;
        names.push({ id: people._id, fullname });
      });

      console.log(names);

      return res.status(200).send({
        msg: "People retrieved successfully!!!",
        people,
        requests: Requests,
        names,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        msg: "Error retrieving people",
        error: err.message,
      });
    });
}

export async function createClass(req, res) {
  try {
    const { tid } = req.params;
    const { title, description, subjects } = req.body;

    const cls = new classesModel({
      title,
      description,
      status: true,
      createdAt: new Date(),
    });

    teachersDataModel
      .updateOne(
        { _id: tid },
        {
          $push: {
            classesAssociated: cls._id,
          },
        }
      )
      .then(async (response) => {
        if (response.modifiedCount > 0) {
          await cls
            .save()
            .then((data) => {
              //validation to check if subjects added or not

              if (subjects && subjects.length > 0) {
                createMultipleSubject(req, res, subjects, cls._id);
              } else {
                res.status(200).send({
                  msg: "Class added successfully",
                  data,
                  classID: cls._id,
                });
              }
            })
            .catch((err) => {
              return res.status(500).send({
                msg: "error saving class",
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    return res.status(500).send({
      msg: "error updating class",
      error: err,
    });
  }
}

export async function createMultipleSubject(req, res, subjects, classID) {
  // const { subjects, classID } = req.body;
  // let subIds = [];

  subjectModel
    .create(subjects)
    .then((subs) => {
      /*Try to add all subject ID */
      const updatePromises = subs.map((sub) => {
        return classesModel.updateOne(
          { _id: classID },
          { $push: { Subjects: sub._id } }
        );
      });

      // Wait for all update operations to complete
      return Promise.all(updatePromises)
        .then(() => {
          return res.status(200).send({
            msg: "Subjects added to class!!!",
            data: subs,
            classID,
          });
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: "Error creating subjects",
        error: err.message,
      });
    });
}

export async function createSubject(req, res) {
  try {
    const { title, description, classID } = req.body;
    const subject = new subjectModel({
      title,
      description,
    });

    if (!classID) {
      return res.status(500).send({
        msg: "ClassID missing !!!",
      });
    }

    await classesModel
      .updateOne(
        { _id: classID },
        {
          $push: {
            Subjects: subject._id,
          },
        }
      )
      .then(async (cls) => {
        await subject
          .save()
          .then((sub) => {
            return res.status(200).send({
              msg: "subject saved successfully!!!",
              sub,
            });
          })
          .catch((err) => {
            return res.status(500).send({
              msg: "Can not save the subject!!!",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).send({
          msg: "can't add subject to class!!!",
          err,
        });
      });
  } catch (error) {
    console.log(error);
  }
}

export async function addTopics(req, res) {
  try {
    const { topics } = req.body;
    const { subjectID } = req.params;
    console.log("topics : ", topics);
    console.log("subjectID : ", subjectID);

    const createdTopics = await topicsModel.create(topics);
    const topicIDs = createdTopics.map((topic) => topic._id);

    const updatedSubject = await subjectModel.findOneAndUpdate(
      { _id: subjectID },
      { $push: { topics: { $each: topicIDs } } },
      { new: true } // To return the updated document
    );

    const subject = await subjectModel
      .findOne({ _id: subjectID })
      .populate("topics");

    return res.status(201).send({
      msg: "Topics added successfully !!!",
      response: subject,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      msg: "Error updating topics",
      error: error.message,
    });
  }
}
export async function getlectures(req, res) {
  const { topicID } = req.params;
  console.log(topicID);

  try {
    const lectures = await topicsModel
      .findOne({ _id: topicID })
      .populate({ path: "lectures" })
      .populate({ path: "Quiz" });
    return res.status(200).send({
      data: lectures,
      msg: "lectures retrieved successfully!!",
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
      msg: "Error retrieving lectures!!",
    });
  }
}

export async function addLectures(req, res) {
  try {
    const { topicID } = req.params;
    const { lectures } = req.body;

    const lecturesdata = await lecturesModel.create(lectures);
    const lectureIDs = lecturesdata.map((lec) => lec._id);

    const UpdatedTopic = await topicsModel.findOneAndUpdate(
      { _id: topicID },
      {
        $push: {
          lectures: {
            $each: lectureIDs,
          },
        },
      },
      { new: true } // Option to return the updated document
    );

    return res.status(200).send({
      data: UpdatedTopic,
      msg: "Updated lectures to topic",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: error,
      msg: "Error creating lectures",
    });
  }
}

export async function addResources(req, res) {
  const { lectureID } = req.params;
  const { files } = req.body;
}

export async function createTopic(req, res) {
  try {
    const { title, description, subjectID } = req.body;
    const topic = new topicsModel({
      title,
      description,
      createdAT: new Date(),
    });

    if (!subjectID) {
      return res.status(500).send({
        msg: "topicID missing !!!",
      });
    }

    subjectModel
      .updateOne(
        {
          _id: subjectID,
        },
        {
          $push: {
            topics: topic._id,
          },
        }
      )
      .then(() => {
        topic
          .save()
          .then((tp) => {
            res.status(200).send({
              msg: "topic saved successfully",
              data: tp,
            });
          })
          .catch((err) => {
            return res.status(500).send({
              msg: "Can't save topic!!!",
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "can't add topic to subject",
          error: err,
        });
      });
  } catch (error) {
    console.log(error);
  }
}

export async function addQuiz(req, res) {
  const { questions, forced } = req.body;
  const { topicID } = req.params;

  const topic = await topicsModel.findOne({ _id: topicID });

  if (!forced) {
    if (topic && topic.Quiz) {
      return res.status(404).send({
        msg: "There's already a quiz",
      });
    }
  }

  if (topic && topic.Quiz.length > 0) {
    await topicsModel
      .updateOne({ _id: topicID }, { $set: { Quiz: [] } })
      .then((data) => {
        console.log("quiz is empty now ", data);
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  }

  const quiz = quizesModel({
    questions,
  });

  await topicsModel
    .updateOne(
      { _id: topicID },
      {
        $push: {
          Quiz: quiz._id,
        },
      }
    )
    .then(async (response) => {
      await quiz
        .save()
        .then((data) => {
          res.status(200).send({
            msg: "Quiz added successfully",
            data,
          });
        })
        .catch((error) => {
          res.status(500).send({
            msg: "Error saving Quiz",
            error,
          });
        });
    })
    .catch((error) => {
      // console.log(error);
      res.status(500).send({
        msg: "error adding quiz to topics",
        error,
      });
    });
}

export async function getQuizData(req, res) {
  const { quizID } = req.body;
  quizesModel
    .findOne({ _id: quizID })
    .then((data) => {
      if (data) {
        return res.status(200).send({
          msg: "Quiz retrieved successfully",
          data: data.questions,
        });
      } else {
        return res.status(404).send({
          msg: "QuizID invalid",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving Quiz",
        error,
      });
    });
}

export async function attempteQuiz(req, res) {
  const { quizID, quizScore } = req.body;
  const { sid } = req.params;

  const student = await studentDataModel.findOne({ _id: sid });
  let attempts;
  const quizes = student.scores["quizes"];
  quizes.map((quiz) => {
    console.log(quiz);
    if (quiz.quizID === quizID) {
      attempts = quiz.attempts;
    }
  });

  // if (!student) {
  //   return res.status(404).send({
  //     msg: "Student not found invalid StudentID",
  //   });
  // }

  // studentDataModel
  //   .updateOne(
  //     { _id: sid },
  //     {
  //       $push: {
  //         "scores.quizes": {
  //           quizID: quizID,
  //           quizScore: quizScore,
  //           attempts: attempts + 1,
  //         },
  //       },
  //     },
  //     { new: true }
  //   )
  //   .then(async (response) => {
  //     const recommendedVideos = await getRecommendedVideos();

  //     var videoIDs = [];

  //     recommendedVideos.contents.map((content) => {
  //       if (content.type == "video") {
  //         videoIDs.push(content.video.videoId);
  //       }
  //     });

  //     if (response.modifiedCount > 0) {
  //       return res.status(200).send({
  //         msg: "data updated!!!",
  //         videoIDs,
  //       });
  //     }
  //     return res.status(404).send({
  //       msg: "Invalid input data",
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return res.status(500).send({
  //       msg: "Error updating data!!!",
  //       error,
  //     });
  //   });
}

export async function addClassCode(req, res) {
  const { classID } = req.params;
  const { code } = req.body;

  const classExist = classesModel.findOne({
    _id: classID,
  });

  if (!classExist) {
    return res.status(404).send({
      msg: "Class not found!!!",
    });
  }

  classesModel
    .updateOne(
      {
        _id: classID,
      },
      {
        $set: {
          classCode: code,
        },
      }
    )
    .then((response) => {
      console.log(response);
      if (response.modifiedCount > 0) {
        return res.status(200).send({
          msg: "Class code updated successfully!!!",
          data: response,
        });
      }
      return res.status(500).send({
        msg: "Failed uploading classCode!!!",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        msg: "Error uploading classCode!!!",
        error: err.message,
      });
    });
}

export async function joinClass(req, res) {
  const { code } = req.body;
  const { sid } = req.params;

  try {
    // Find the class using the provided class code
    let classData;
    let classExist;
    await classesModel
      .findOne({ classCode: code })
      .then((data) => {
        classData = data;
      })
      .catch((err) => {
        console.log(err);
      });

    if (!classData) {
      return res.status(404).send({
        msg: "Classcode not found or expired!!!",
      });
    }

    classExist = await studentDataModel.findOne({
      _id: sid,
      "enrolls.classes": {
        $in: [classData._id],
      },
    });

    if (classExist) {
      console.log(classExist);
      return res.status(500).send({
        msg: "Class already exists in your enrollments!!!",
      });
    }

    const classID = classData._id;

    const requestCheck = await requestsModel.findOne({
      studentID: sid,
      classID: classID,
    });

    if (requestCheck) {
      return res.status(201).send({
        msg: "You've already requested to join please wait or ask faculty!!!",
      });
    }

    const student = await studentDataModel.findOne({
      _id: sid,
    });

    let sname;
    if (student) {
      const userInfo = await usersModel.findOne({
        _id: student.userID,
      });

      sname = `${userInfo.fname} ${userInfo.lname}`;
    }

    // Create a new request
    const request = new requestsModel({
      classID: classID,
      studentID: sid,
      status: true,
      studentData: {
        name: sname,
      },
    });

    // Save the request
    const savedRequest = await request.save();

    // check if there's any error saving request

    // Save the request ID to the class document
    const response = await classesModel.updateOne(
      { _id: classID },
      { $push: { Requests: savedRequest._id } }
    );

    if (response.modifiedCount > 0) {
      // Update student data
      const studentDataUpdate = await studentDataModel.updateOne(
        { _id: sid },
        { $push: { requests: savedRequest._id } }
      );

      if (studentDataUpdate.modifiedCount > 0) {
        return res.status(200).send({
          msg: "Request to join the class sent successfully!!!",
          data: studentDataUpdate,
        });
      } else {
        return res.status(500).send({
          msg: "Error sending request student data not modified!!!",
        });
      }
    } else {
      return res.status(500).send({
        msg: "Error saving request to classmodel!!!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      msg: "Error sending request!!!",
      error: err.message,
    });
  }
}

export async function createLecture(req, res) {
  const { title, description, lectureLink, topicID } = req.body;

  const lecture = new lecturesModel({
    title,
    description,
    lec_link: lectureLink,
  });

  if (!topicID) {
    return res.status(500).send({
      msg: "topicID missing !!!",
    });
  }

  await topicsModel
    .updateOne(
      {
        _id: topicID,
      },
      {
        $push: {
          lectures: lecture._id,
        },
      }
    )
    .then(async () => {
      await lecture
        .save()
        .then((lec) => {
          return res.status(200).send({
            msg: "Lecture added successfully",
            data: lec,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            msg: "can't save lecture!!!",
            error,
          });
        });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Can't add to lecture to topics!!!",
        error,
      });
    });
}

export async function getusers(req, res) {
  const { ids } = req.body;

  usersModel
    .find({ _id: { $in: ids } })
    .then((users) => {
      if (users.length > 0) {
        return res.status(200).send({
          msg: "Users retrieved",
          data: users,
        });
      } else {
        return res.status(404).send({
          msg: "No users found with the provided IDs",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving users",
        error: error.message,
      });
    });
}

export async function getRecommendedVideos() {
  const options = {
    method: "GET",
    url: "https://youtube138.p.rapidapi.com/search/",
    params: {
      q: "Machine learning",
      hl: "en",
      gl: "US",
    },
    headers: {
      "X-RapidAPI-Key": "b79cee61f7msh7d57bdb8220c1b0p1fcb13jsn8b60ff87af10",
      "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function acceptRequest(req, res) {
  const { reqID, classID, studentID } = req.body;

  const studentExistInClass = await classesModel.findOne({
    _id: classID,
    people: {
      $in: [studentID],
    },
  });

  if (studentExistInClass) {
    return res.status(404).send({
      msg: "You're already in !!!!!",
    });
  }

  let classUpdate;
  await classesModel
    .updateOne(
      { _id: classID },
      {
        $push: {
          people: studentID,
        },
        $set: {
          peopleType: "studentData",
        },
      }
    )
    .then((data) => {
      classUpdate = data;
    })
    .catch((err) => {
      console.log(err);
    });

  let studentUpdate;

  await studentDataModel
    .updateOne(
      { _id: studentID },
      {
        $push: {
          "enrolls.classes": classID,
        },
      }
    )
    .then((data) => {
      studentUpdate = data;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(studentUpdate, classUpdate);

  if (classUpdate.modifiedCount && studentUpdate.modifiedCount) {
    deleteRequest(req, res, reqID, classID, studentID).then(() => {
      return res.status(200).send({
        msg: "Request accepted successfully",
      });
    });
  } else {
    return res.status(500).send({
      msg: "Error updating classID to either student or class model",
    });
  }
}

export async function deleteRequest(
  req,
  res,
  reqID,
  classID,
  studentID,
  reject = false
) {
  try {
    // Delete request from requestsModel
    const reqDelete = await requestsModel.deleteOne({ _id: reqID });

    if (reqDelete.deletedCount === 0) {
      return res.status(500).send({
        msg: "Cannot delete request or request not found",
      });
    }

    // Remove request from classModel
    const classReqDelete = await classesModel.updateOne(
      { _id: classID },
      { $pull: { Requests: reqID } }
    );

    if (classReqDelete.nModified === 0) {
      return res.status(500).send({
        msg: "Cannot remove request from classModel or request not found in classModel",
      });
    }

    // Remove request from studentDataModel
    const stdReqDelete = await studentDataModel.updateOne(
      { _id: studentID },
      { $pull: { Requests: reqID } }
    );

    if (stdReqDelete.nModified === 0) {
      return res.status(500).send({
        msg: "Cannot remove request from studentDataModel or request not found in studentDataModel",
      });
    }

    if (reject) {
      return res.status(200).send({
        msg: "Request deleted !!!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      msg: "Error deleting request!!!",
      error: error.message,
    });
  }
}

export async function cancelRequest(req, res) {
  const { reqID, classID, studentID } = req.body;
  console.log(req.body);
  deleteRequest(req, res, reqID, classID, studentID, true);
}
