function generateDummyClassObjects(numClasses) {
  const dummyClasses = [];

  for (let i = 1; i <= numClasses; i++) {
    const classObject = {
      classID: `classID_${i}`,
      title: `Class ${i}`,
      description: `Class ${i} description`,
      status: true,
      created_At: new Date(),
      classCode: `classCode_${i}`,
      Subjects: [
        {
          index: 1,
          subject_id: `subjectID_${i}`,
          title: `Subject ${i}`,
          description: `Subject ${i} description`,
          created_At: new Date(),
          topics: [
            {
              index: 1,
              topic_id: `topicID_${i}`,
              title: `Topic ${i}`,
              description: `Topic ${i} description`,
              created_At: new Date(),
              lectures: [
                {
                  index: 1,
                  lecID: `lectureID_${i}`,
                  title: `Lecture ${i}`,
                  description: `Lecture ${i} description`,
                  lecLink: `https://www.youtube.com/watch?v=VvYADzRwJK8&t=150s`,
                },
              ],
            },
          ],
        },
      ],
      resources: [
        {
          resource_id: `resourceID_${i}`,
          subjectID: [`subjectID_${i}`],
          topicID: [`topicID_${i}`],
          lectureID: [`lectureID_${i}`],
          resourceData: `resourceLink_${i}`,
        },
      ],
      assignments: [
        {
          assignmentID: `assignmentID_${i}`,
          relation: `classID_${i}`,
          status: true,
        },
        {
          assignmentID: `assignmentID_${i}`,
          relation: `subjectID_${i}`,
          status: true,
        },
        {
          assignmentID: `assignmentID_${i}`,
          relation: `topicID_${i}`,
          status: false,
        },
      ],
    };

    dummyClasses.push(classObject);
  }

  return dummyClasses;
}

// Generate 3 dummy class objects
const numClassesToGenerate = 3;
const dummyClasses = generateDummyClassObjects(numClassesToGenerate);

export default dummyClasses;
