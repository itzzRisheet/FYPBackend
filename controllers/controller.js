import dummyClasses from "../helper/helper.js";

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

export function getClasses(req, res){
  try {
    res.status(200).send({
      classes : dummyClasses
    })
  } catch (error) {
    res.status(500).send({
      error,
      msg : "can't get classes",
    })
    
  }
}