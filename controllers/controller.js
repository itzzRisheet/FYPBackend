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

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).send({
      msg: "Enter your email and password!!!",
    });
  }

  await usersModel
    .findOne({ email })
    .then(async (user) => {
      await bcrypt
        .compare(password, user.password)
        .then((match) => {
    
          if (match) {
            console.log(user);
            const token = jwt.sign(
              {
                userID: user._id,
                roleID: user.usersData,
                email: user.email,
                role: user.role,
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
          res.status(500).send({
            msg: "wrong password",
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).send({
        msg: "User not found",
        error: err.message,
      });
    });
}

export async function createUser(req, res) {
  const { fname, lname, email, role, password } = req.body;
  console.log(role);

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
      reject(error);
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
        });
        console.log(user);

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
            classnames.push({ title: cls.title, classID: cls._id });
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
            classnames.push({ title: cls.title, classID: cls._id });
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
  console.log(classID);

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
  let subIds = [];

  subjectModel
    .create(subjects)
    .then((subs) => {
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
  const { questions, topicID } = req.body;

  const quiz = quizesModel({
    questions,
  });

  await topicsModel
    .updateOne(
      { _id: topicID },
      {
        $push: {
          quizes: quiz._id,
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
      console.log(error);
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

  studentDataModel
    .updateOne(
      { _id: sid },
      {
        $push: {
          "scores.quizes": { quizID: quizID, quizScore: quizScore },
        },
      },
      { new: true }
    )
    .then(async (response) => {
      const recommendedVideos = await getRecommendedVideos();

      var videoIDs = [];

      recommendedVideos.contents.map((content) => {
        if (content.type == "video") {
          videoIDs.push(content.video.videoId);
        }
      });

      if (response.modifiedCount > 0) {
        return res.status(200).send({
          msg: "data updated!!!",
          videoIDs,
        });
      }
      return res.status(404).send({
        msg: "Invalid input data",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        msg: "Error updating data!!!",
        error,
      });
    });
}

export async function joinClass(req, res) {
  const { classID } = req.body;
  const { sid } = req.params;
  console.log(sid, classID);

  studentDataModel
    .updateOne(
      { _id: sid },
      {
        $addToSet: {
          "enrolls.classes": classID,
        },
      }
    )
    .then(async (response) => {
      res.status(200).send({
        msg: "user Data updated successfully",
        response,
      });
    })
    .catch((error) => {
      res.status(500).send({
        msg: "Error updating class to userdata",
        error: error.message,
      });
    });
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
  usersModel
    .find({})
    .then((users) => {
      return res.status(200).send({
        msg: "Users retrieved",
        data: users,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving users",
        error,
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
