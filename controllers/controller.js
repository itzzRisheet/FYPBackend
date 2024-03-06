import * as dd from "../helper/dummyData.js";
import * as helper from "../helper/helper.js";
import classesModel from "../models/classes.model.js";
import lecturesModel from "../models/lectures.model.js";
import studentDataModel from "../models/studentData.model.js";
import subjectModel from "../models/subject.model.js";
import teachersDataMode from "../models/teachersData.mode.js";
import topicsModel from "../models/topics.model.js";
import usersModel from "../models/users.model.js";
import Users from "../models/users.model.js";

export async function createUser(req, res ) {
  const { fname, lname, email, role } = req.body;

  const user = new usersModel({
    fname,
    lname,
    email,
    createDate: new Date(),
    role,
  });

  await user
    .save()
    .then((data) => {
      return res.status(200).send({
        msg: "user created successfully!!",
        data,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error creating user",
        error,
      });
    });
}

export async function createStudent(req, res) {
  const { userID } = req.body;
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
          return res.status(200).send({
            msg: "Student created successfully",
            data: s,
          });
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

export async function createTeacher(req, res) {
  const { userID } = req.body;

  const teacher = teachersDataMode({});

  await usersModel.updateOne(
    { _id: userID },
    {
      $set: {
        usersData : teacher._id,
      },
    }
  ).then(() => {
    teacher.save().then((t) => {
      return res.status(200).send({
        msg : "Teacher added successfully",
        data : t
      })
    }).catch((error) => {
      return res.status(500).send({
        msg : "Can not add teacher",
        error
      })
    })
  }).catch((error) => {
    return res.status(500).send({
      msg : "can't add teacher to users",
      error
    })
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

export function getClasses(req, res) {
  const { classID } = req.params;

  console.log(req.params);
  classesModel
    .findOne({ _id: classID })
    .populate({ path: "Subjects" })
    .then((cls) => {
      const subjectNames = cls["Subjects"].map((sub) => {
        return sub.title;
      });
      return res.status(200).send({
        msg: "class retrieved successfully!!",
        data: subjectNames,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving class!!!",
        error,
      });
    });
}

export async function createClass(req, res) {
  try {
    const { title, description, status, classCode } = req.body;
    const cls = new classesModel({
      title,
      description,
      status,
      classCode,
      createdAt: new Date(),
    });

    await cls
      .save()
      .then((data) => {
        return res.status(200).send({
          msg: "class saved successfully",
          data,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          msg: "error saving class",
          error: err,
        });
      });
  } catch (error) {
    console.log(error);
  }
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
        msg: "topicID missing !!!",
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
