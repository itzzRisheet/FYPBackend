import { studentData } from "./dummyData.js";

export function addStudentToClass(studentID) {
  try {
    return true;
  } catch (error) {
    return false;
  }
}

export { studentData };
