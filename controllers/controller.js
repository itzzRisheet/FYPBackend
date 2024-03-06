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

export async function createUser(req, res) {
  const { fname, lname, email, role } = req.body;

  const user = new usersModel({
    fname,
    lname,
    email,
    createDate: new Date(),
    role,
    userRole: role ? "studentData" : "TeachersData",
  });

  await user
    .save()
    .then((data) => {
      if(role){
        createStudent(res,user._id);
      }else{
        createTeacher(res,user._id);
      }
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

export async function createStudent( res, userID) {
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

export async function createTeacher( res,userID) {

  const teacher = teachersDataMode({});

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
          return res.status(200).send({
            msg: "Teacher added successfully",
            data: t,
          });
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
      if (cls) {
        const subjectNames = cls["Subjects"].map((sub) => {
          return sub.title;
        });
        return res.status(200).send({
          msg: "class retrieved successfully!!",
          data: subjectNames,
        });
      }
      return res.status(404).send({
        msg: "Invalid classID",
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "Error retrieving class!!!",
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
          data: data.Subjects,
        });
      }
      return res.status(404).send({
        msg: "invalid classID",
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
          sub,
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
          lecture,
        });
      }
      return res.status(404).send({
        msg: "Invalid lecture ID",
      });
    })
    .catch((err) => {
      return res.status(500).send({
        msg: "Can't find Lecture data",
        err,
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
