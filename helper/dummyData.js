export const dummyClasses = [
  {
    classID: "classID_1",
    title: "Class 1",
    description: "Class 1 description",
    status: true,
    created_At: "2024-03-05T15:01:25.230Z",
    classCode: 123,
    Subjects: [
      {
        index: 1,
        subject_id: "subjectID_1",
        title: "Subject 1",
        description: "Subject 1 description",
        created_At: "2024-03-05T15:01:25.230Z",
        topics: [
          {
            index: 1,
            topic_id: "topicID_1",
            title: "Topic 1",
            description: "Topic 1 description",
            created_At: "2024-03-05T15:01:25.230Z",
            lectures: [
              {
                index: 1,
                lecID: "lectureID_1",
                title: "Lecture 1",
                description: "Lecture 1 description",
                lecLink: "https://www.youtube.com/watch?v=VvYADzRwJK8&t=150s",
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        resource_id: "resourceID_1",
        subjectID: ["subjectID_1"],
        topicID: ["topicID_1"],
        lectureID: ["lectureID_1"],
        resourceData: "resourceLink_1",
      },
    ],
    assignments: [
      {
        assignmentID: "assignmentID_1",
        relation: "classID_1",
        status: true,
      },
      {
        assignmentID: "assignmentID_1",
        relation: "subjectID_1",
        status: true,
      },
      {
        assignmentID: "assignmentID_1",
        relation: "topicID_1",
        status: false,
      },
    ],
    people: {
      teachers: [],
      students: [],
    },
  },
  {
    classID: "classID_2",
    title: "Class 2",
    description: "Class 2 description",
    status: true,
    created_At: "2024-03-05T15:01:25.230Z",
    classCode: 124,
    Subjects: [
      {
        index: 1,
        subject_id: "subjectID_2",
        title: "Subject 2",
        description: "Subject 2 description",
        created_At: "2024-03-05T15:01:25.230Z",
        topics: [
          {
            index: 1,
            topic_id: "topicID_2",
            title: "Topic 2",
            description: "Topic 2 description",
            created_At: "2024-03-05T15:01:25.230Z",
            lectures: [
              {
                index: 1,
                lecID: "lectureID_2",
                title: "Lecture 2",
                description: "Lecture 2 description",
                lecLink: "https://www.youtube.com/watch?v=VvYADzRwJK8&t=150s",
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        resource_id: "resourceID_2",
        subjectID: ["subjectID_2"],
        topicID: ["topicID_2"],
        lectureID: ["lectureID_2"],
        resourceData: "resourceLink_2",
      },
    ],
    assignments: [
      {
        assignmentID: "assignmentID_2",
        relation: "classID_2",
        status: true,
      },
      {
        assignmentID: "assignmentID_2",
        relation: "subjectID_2",
        status: true,
      },
      {
        assignmentID: "assignmentID_2",
        relation: "topicID_2",
        status: false,
      },
    ],
    people: {
      teachers: [],
      students: [],
    },
  },
  {
    classID: "classID_3",
    title: "Class 3",
    description: "Class 3 description",
    status: true,
    created_At: "2024-03-05T15:01:25.230Z",
    classCode: 125,
    Subjects: [
      {
        index: 1,
        subject_id: "subjectID_3",
        title: "Subject 3",
        description: "Subject 3 description",
        created_At: "2024-03-05T15:01:25.230Z",
        topics: [
          {
            index: 1,
            topic_id: "topicID_3",
            title: "Topic 3",
            description: "Topic 3 description",
            created_At: "2024-03-05T15:01:25.230Z",
            lectures: [
              {
                index: 1,
                lecID: "lectureID_3",
                title: "Lecture 3",
                description: "Lecture 3 description",
                lecLink: "https://www.youtube.com/watch?v=VvYADzRwJK8&t=150s",
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        resource_id: "resourceID_3",
        subjectID: ["subjectID_3"],
        topicID: ["topicID_3"],
        lectureID: ["lectureID_3"],
        resourceData: "resourceLink_3",
      },
    ],
    assignments: [
      {
        assignmentID: "assignmentID_3",
        relation: "classID_3",
        status: true,
      },
      {
        assignmentID: "assignmentID_3",
        relation: "subjectID_3",
        status: true,
      },
      {
        assignmentID: "assignmentID_3",
        relation: "topicID_3",
        status: false,
      },
    ],
    people: {
      teachers: [],
      students: [],
    },
  },
];

export const studentData = [];
