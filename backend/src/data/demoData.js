const bcrypt = require('bcryptjs');

const adminPasswordHash = bcrypt.hashSync('password123', 12);
const demoPasswordHash = bcrypt.hashSync('password123', 12);

const departments = [
  {
    "id": 1,
    "department_name": "CSE"
  },
  {
    "id": 2,
    "department_name": "AI"
  },
  {
    "id": 3,
    "department_name": "MECH"
  },
  {
    "id": 4,
    "department_name": "ECE"
  }
];

const users = [
  {
    id: 1,
    name: 'System Admin',
    email: 'admin@college.edu',
    password: adminPasswordHash,
    role: 'admin',
  },
  {
    id: 2,
    name: 'Event Coordinator',
    email: 'coordinator@college.edu',
    password: demoPasswordHash,
    role: 'user',
  },
];

const events = [
  {
    "id": 1,
    "title": "Event_1",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-03-08",
    "venue": "Auditorium",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Event_2",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-04-02",
    "venue": "Main Hall",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 3,
    "title": "Event_3",
    "category": "Cultural",
    "department_id": 2,
    "date": "2025-01-18",
    "venue": "Auditorium",
    "organizer": "Tech Society",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 4,
    "title": "Event_4",
    "category": "Workshop",
    "department_id": 2,
    "date": "2025-03-26",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 5,
    "title": "Event_5",
    "category": "Sports",
    "department_id": 3,
    "date": "2025-03-05",
    "venue": "Auditorium",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 6,
    "title": "Event_6",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-04-04",
    "venue": "Lab 1",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 7,
    "title": "Event_7",
    "category": "Technical",
    "department_id": 4,
    "date": "2025-04-18",
    "venue": "Main Hall",
    "organizer": "Tech Society",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 8,
    "title": "Event_8",
    "category": "Sports",
    "department_id": 1,
    "date": "2025-03-19",
    "venue": "Auditorium",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 9,
    "title": "Event_9",
    "category": "Cultural",
    "department_id": 1,
    "date": "2025-03-03",
    "venue": "Auditorium",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 10,
    "title": "Event_10",
    "category": "Sports",
    "department_id": 3,
    "date": "2025-04-21",
    "venue": "Lab 1",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 11,
    "title": "Event_11",
    "category": "Sports",
    "department_id": 4,
    "date": "2025-02-22",
    "venue": "Lab 1",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 12,
    "title": "Event_12",
    "category": "Cultural",
    "department_id": 2,
    "date": "2025-02-15",
    "venue": "Ground",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 13,
    "title": "Event_13",
    "category": "Sports",
    "department_id": 2,
    "date": "2025-01-08",
    "venue": "Main Hall",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 14,
    "title": "Event_14",
    "category": "Sports",
    "department_id": 3,
    "date": "2025-01-07",
    "venue": "Lab 1",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 15,
    "title": "Event_15",
    "category": "Workshop",
    "department_id": 3,
    "date": "2025-04-05",
    "venue": "Lab 1",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 16,
    "title": "Event_16",
    "category": "Sports",
    "department_id": 2,
    "date": "2025-04-19",
    "venue": "Ground",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 17,
    "title": "Event_17",
    "category": "Cultural",
    "department_id": 2,
    "date": "2025-04-03",
    "venue": "Main Hall",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 18,
    "title": "Event_18",
    "category": "Cultural",
    "department_id": 2,
    "date": "2025-04-20",
    "venue": "Main Hall",
    "organizer": "Tech Society",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 19,
    "title": "Event_19",
    "category": "Workshop",
    "department_id": 3,
    "date": "2025-03-18",
    "venue": "Main Hall",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 20,
    "title": "Event_20",
    "category": "Sports",
    "department_id": 4,
    "date": "2025-01-10",
    "venue": "Ground",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 21,
    "title": "Event_21",
    "category": "Technical",
    "department_id": 3,
    "date": "2025-03-17",
    "venue": "Auditorium",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 22,
    "title": "Event_22",
    "category": "Cultural",
    "department_id": 4,
    "date": "2025-02-12",
    "venue": "Auditorium",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 23,
    "title": "Event_23",
    "category": "Workshop",
    "department_id": 4,
    "date": "2025-01-04",
    "venue": "Lab 1",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 24,
    "title": "Event_24",
    "category": "Technical",
    "department_id": 2,
    "date": "2025-02-19",
    "venue": "Main Hall",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 25,
    "title": "Event_25",
    "category": "Technical",
    "department_id": 3,
    "date": "2025-02-05",
    "venue": "Ground",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 26,
    "title": "Event_26",
    "category": "Workshop",
    "department_id": 4,
    "date": "2025-02-18",
    "venue": "Auditorium",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 27,
    "title": "Event_27",
    "category": "Sports",
    "department_id": 3,
    "date": "2025-04-17",
    "venue": "Ground",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 28,
    "title": "Event_28",
    "category": "Cultural",
    "department_id": 2,
    "date": "2025-01-11",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 29,
    "title": "Event_29",
    "category": "Technical",
    "department_id": 2,
    "date": "2025-01-23",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 30,
    "title": "Event_30",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-03-03",
    "venue": "Auditorium",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 31,
    "title": "Event_31",
    "category": "Cultural",
    "department_id": 3,
    "date": "2025-02-24",
    "venue": "Ground",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 32,
    "title": "Event_32",
    "category": "Workshop",
    "department_id": 3,
    "date": "2025-02-04",
    "venue": "Main Hall",
    "organizer": "Tech Society",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 33,
    "title": "Event_33",
    "category": "Workshop",
    "department_id": 4,
    "date": "2025-04-15",
    "venue": "Main Hall",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 34,
    "title": "Event_34",
    "category": "Workshop",
    "department_id": 1,
    "date": "2025-03-26",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 35,
    "title": "Event_35",
    "category": "Cultural",
    "department_id": 2,
    "date": "2025-04-05",
    "venue": "Ground",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 36,
    "title": "Event_36",
    "category": "Workshop",
    "department_id": 4,
    "date": "2025-02-28",
    "venue": "Main Hall",
    "organizer": "Tech Society",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 37,
    "title": "Event_37",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-01-03",
    "venue": "Auditorium",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 38,
    "title": "Event_38",
    "category": "Workshop",
    "department_id": 3,
    "date": "2025-04-07",
    "venue": "Ground",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 39,
    "title": "Event_39",
    "category": "Workshop",
    "department_id": 2,
    "date": "2025-01-13",
    "venue": "Lab 1",
    "organizer": "Tech Society",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 40,
    "title": "Event_40",
    "category": "Workshop",
    "department_id": 4,
    "date": "2025-04-05",
    "venue": "Auditorium",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 41,
    "title": "Event_41",
    "category": "Technical",
    "department_id": 2,
    "date": "2025-01-24",
    "venue": "Lab 1",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 42,
    "title": "Event_42",
    "category": "Workshop",
    "department_id": 1,
    "date": "2025-02-02",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 43,
    "title": "Event_43",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-02-13",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 44,
    "title": "Event_44",
    "category": "Technical",
    "department_id": 1,
    "date": "2025-04-22",
    "venue": "Lab 1",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 45,
    "title": "Event_45",
    "category": "Sports",
    "department_id": 2,
    "date": "2025-02-09",
    "venue": "Ground",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 46,
    "title": "Event_46",
    "category": "Workshop",
    "department_id": 4,
    "date": "2025-03-25",
    "venue": "Main Hall",
    "organizer": "Coding Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 47,
    "title": "Event_47",
    "category": "Technical",
    "department_id": 3,
    "date": "2025-01-18",
    "venue": "Auditorium",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 48,
    "title": "Event_48",
    "category": "Sports",
    "department_id": 2,
    "date": "2025-01-08",
    "venue": "Lab 1",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 49,
    "title": "Event_49",
    "category": "Workshop",
    "department_id": 2,
    "date": "2025-03-20",
    "venue": "Main Hall",
    "organizer": "Sports Committee",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  },
  {
    "id": 50,
    "title": "Event_50",
    "category": "Cultural",
    "department_id": 1,
    "date": "2025-03-04",
    "venue": "Main Hall",
    "organizer": "Cultural Club",
    "description": "",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
];

const participants = [
  {
    "id": 1,
    "event_id": 1,
    "student_name": "Aaliya Roy Gupta",
    "roll_no": "123378",
    "department": "ECE",
    "year": "2nd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "event_id": 2,
    "student_name": "Aashish Monga",
    "roll_no": "123308",
    "department": "ECE",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 3,
    "event_id": 3,
    "student_name": "Abhishek N S Reddy",
    "roll_no": "123966",
    "department": "CSE",
    "year": "1st Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 4,
    "event_id": 4,
    "student_name": "Aditya Vilas Pawaskar",
    "roll_no": "123949",
    "department": "ECE",
    "year": "1st Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 5,
    "event_id": 5,
    "student_name": "BINDUSREE G K",
    "roll_no": "123441",
    "department": "AI",
    "year": "3rd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 6,
    "event_id": 6,
    "student_name": "CHAITHRA GANA G",
    "roll_no": "123859",
    "department": "MECH",
    "year": "4th Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 7,
    "event_id": 7,
    "student_name": "CHANDAN KRISHNA M",
    "roll_no": "123214",
    "department": "CSE",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 8,
    "event_id": 8,
    "student_name": "DHEERAJ Y Gowda",
    "roll_no": "123954",
    "department": "ECE",
    "year": "2nd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 9,
    "event_id": 9,
    "student_name": "DRUTHISHA B",
    "roll_no": "123230",
    "department": "CSE",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 10,
    "event_id": 10,
    "student_name": "GT VAISHNAVI",
    "roll_no": "123915",
    "department": "CSE",
    "year": "3rd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 11,
    "event_id": 11,
    "student_name": "GAGAN T",
    "roll_no": "123798",
    "department": "AI",
    "year": "1st Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 12,
    "event_id": 12,
    "student_name": "Harshal Gowda CM",
    "roll_no": "123898",
    "department": "MECH",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 13,
    "event_id": 13,
    "student_name": "HEMANTH KUMAR K V",
    "roll_no": "123985",
    "department": "AI",
    "year": "2nd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 14,
    "event_id": 14,
    "student_name": "K Shreya",
    "roll_no": "123125",
    "department": "AI",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 15,
    "event_id": 15,
    "student_name": "KAMASALA PRANEETH ACHARI",
    "roll_no": "123921",
    "department": "AI",
    "year": "3rd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 16,
    "event_id": 16,
    "student_name": "KOLISETTY NIKITH",
    "roll_no": "123906",
    "department": "CSE",
    "year": "4th Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 17,
    "event_id": 17,
    "student_name": "M Sai Shashank",
    "roll_no": "123979",
    "department": "MECH",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 18,
    "event_id": 18,
    "student_name": "M.MADHUMITHA",
    "roll_no": "123936",
    "department": "MECH",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 19,
    "event_id": 19,
    "student_name": "Manjunath S",
    "roll_no": "123940",
    "department": "AI",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 20,
    "event_id": 20,
    "student_name": "Meghana B",
    "roll_no": "123775",
    "department": "AI",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 21,
    "event_id": 21,
    "student_name": "Nagul krishnan",
    "roll_no": "123385",
    "department": "CSE",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 22,
    "event_id": 22,
    "student_name": "NAVEEN KUMAR B N",
    "roll_no": "123756",
    "department": "MECH",
    "year": "3rd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 23,
    "event_id": 23,
    "student_name": "Neha Rajkumar",
    "roll_no": "123218",
    "department": "ECE",
    "year": "2nd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 24,
    "event_id": 24,
    "student_name": "PALLAVI B N",
    "roll_no": "123139",
    "department": "CSE",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 25,
    "event_id": 25,
    "student_name": "PAVITHRA M",
    "roll_no": "123846",
    "department": "ECE",
    "year": "4th Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 26,
    "event_id": 26,
    "student_name": "PUNARVASU T B",
    "roll_no": "123494",
    "department": "AI",
    "year": "3rd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 27,
    "event_id": 27,
    "student_name": "PUTTAMREDDY LALITHYA",
    "roll_no": "123825",
    "department": "MECH",
    "year": "1st Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 28,
    "event_id": 28,
    "student_name": "RAVITEJA P",
    "roll_no": "123472",
    "department": "MECH",
    "year": "1st Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 29,
    "event_id": 29,
    "student_name": "PINAKAPANI P",
    "roll_no": "123738",
    "department": "ECE",
    "year": "1st Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 30,
    "event_id": 30,
    "student_name": "Shriyansu Rou Ray",
    "roll_no": "123619",
    "department": "ECE",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 31,
    "event_id": 31,
    "student_name": "Shyama Rai",
    "roll_no": "123512",
    "department": "ECE",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 32,
    "event_id": 32,
    "student_name": "Sindhu G V",
    "roll_no": "123530",
    "department": "MECH",
    "year": "2nd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 33,
    "event_id": 33,
    "student_name": "SINGARAYANI NAG NISHAL",
    "roll_no": "123515",
    "department": "CSE",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 34,
    "event_id": 34,
    "student_name": "Sonu N",
    "roll_no": "123315",
    "department": "MECH",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 35,
    "event_id": 35,
    "student_name": "SUHITA SAI SALAKA",
    "roll_no": "123552",
    "department": "MECH",
    "year": "2nd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 36,
    "event_id": 36,
    "student_name": "SUPRABHA K V",
    "roll_no": "123912",
    "department": "AI",
    "year": "1st Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 37,
    "event_id": 37,
    "student_name": "TAYAANANTHAA V V",
    "roll_no": "123627",
    "department": "ECE",
    "year": "1st Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 38,
    "event_id": 38,
    "student_name": "THAYAANITHI V V",
    "roll_no": "123788",
    "department": "ECE",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 39,
    "event_id": 39,
    "student_name": "Vemana Hemanth babu",
    "roll_no": "123250",
    "department": "CSE",
    "year": "1st Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 40,
    "event_id": 40,
    "student_name": "VETTRIVEEL S",
    "roll_no": "123586",
    "department": "CSE",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 41,
    "event_id": 41,
    "student_name": "Vishal K V",
    "roll_no": "123744",
    "department": "AI",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 42,
    "event_id": 42,
    "student_name": "Yashas G Hombal",
    "roll_no": "123509",
    "department": "AI",
    "year": "2nd Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 43,
    "event_id": 43,
    "student_name": "YASHASWINI M G",
    "roll_no": "123868",
    "department": "CSE",
    "year": "4th Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 44,
    "event_id": 44,
    "student_name": "Yashwanth Sai",
    "roll_no": "123280",
    "department": "MECH",
    "year": "1st Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 45,
    "event_id": 45,
    "student_name": "AKASH",
    "roll_no": "123968",
    "department": "CSE",
    "year": "4th Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 46,
    "event_id": 46,
    "student_name": "GANESH NAYAK G S",
    "roll_no": "123920",
    "department": "MECH",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 47,
    "event_id": 47,
    "student_name": "HANMANTHRAO",
    "roll_no": "123727",
    "department": "MECH",
    "year": "4th Year",
    "participant_type": "internal",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 48,
    "event_id": 48,
    "student_name": "HARSHITHA P",
    "roll_no": "123861",
    "department": "MECH",
    "year": "4th Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 49,
    "event_id": 49,
    "student_name": "LAKSHMEESH SANTOSH SHET",
    "roll_no": "123869",
    "department": "AI",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 50,
    "event_id": 50,
    "student_name": "MALLIKARJUN",
    "roll_no": "123741",
    "department": "AI",
    "year": "3rd Year",
    "participant_type": "external",
    "created_at": "2025-01-01T12:00:00.000Z"
  }
];

const participation = [
  {
    "id": 1,
    "event_id": 5,
    "participant_id": 46,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 2,
    "event_id": 19,
    "participant_id": 16,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 3,
    "event_id": 18,
    "participant_id": 22,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 4,
    "event_id": 21,
    "participant_id": 35,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 5,
    "event_id": 6,
    "participant_id": 9,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 6,
    "event_id": 10,
    "participant_id": 15,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 7,
    "event_id": 25,
    "participant_id": 45,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 8,
    "event_id": 10,
    "participant_id": 46,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 9,
    "event_id": 14,
    "participant_id": 5,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 10,
    "event_id": 27,
    "participant_id": 27,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 11,
    "event_id": 22,
    "participant_id": 35,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 12,
    "event_id": 30,
    "participant_id": 27,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 13,
    "event_id": 4,
    "participant_id": 14,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 14,
    "event_id": 27,
    "participant_id": 25,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 15,
    "event_id": 50,
    "participant_id": 38,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 16,
    "event_id": 45,
    "participant_id": 2,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 17,
    "event_id": 49,
    "participant_id": 37,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 18,
    "event_id": 25,
    "participant_id": 31,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 19,
    "event_id": 1,
    "participant_id": 23,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 20,
    "event_id": 20,
    "participant_id": 49,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 21,
    "event_id": 25,
    "participant_id": 27,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 22,
    "event_id": 35,
    "participant_id": 48,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 23,
    "event_id": 48,
    "participant_id": 35,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 24,
    "event_id": 39,
    "participant_id": 15,
    "participation_date": "2026-01-10",
    "status": "registered",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 25,
    "event_id": 32,
    "participant_id": 15,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 26,
    "event_id": 18,
    "participant_id": 28,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 27,
    "event_id": 32,
    "participant_id": 2,
    "participation_date": "2026-01-10",
    "status": "registered",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 28,
    "event_id": 25,
    "participant_id": 22,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 29,
    "event_id": 43,
    "participant_id": 44,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 30,
    "event_id": 26,
    "participant_id": 47,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 31,
    "event_id": 11,
    "participant_id": 30,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 32,
    "event_id": 9,
    "participant_id": 40,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 33,
    "event_id": 35,
    "participant_id": 2,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 34,
    "event_id": 26,
    "participant_id": 38,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 35,
    "event_id": 37,
    "participant_id": 43,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 36,
    "event_id": 2,
    "participant_id": 6,
    "participation_date": "2026-01-10",
    "status": "absent",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 37,
    "event_id": 42,
    "participant_id": 28,
    "participation_date": "2026-01-10",
    "status": "registered",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 38,
    "event_id": 9,
    "participant_id": 30,
    "participation_date": "2026-01-10",
    "status": "registered",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 39,
    "event_id": 12,
    "participant_id": 4,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 40,
    "event_id": 17,
    "participant_id": 25,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 41,
    "event_id": 21,
    "participant_id": 14,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 42,
    "event_id": 30,
    "participant_id": 21,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 43,
    "event_id": 22,
    "participant_id": 49,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 44,
    "event_id": 25,
    "participant_id": 18,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 45,
    "event_id": 49,
    "participant_id": 27,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 46,
    "event_id": 17,
    "participant_id": 6,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 47,
    "event_id": 31,
    "participant_id": 2,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 48,
    "event_id": 48,
    "participant_id": 35,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 49,
    "event_id": 4,
    "participant_id": 23,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  },
  {
    "id": 50,
    "event_id": 15,
    "participant_id": 42,
    "participation_date": "2026-01-10",
    "status": "attended",
    "created_at": "2025-01-01T12:30:00.000Z"
  }
];

const results = [
  {
    "id": 1,
    "event_id": 5,
    "participant_id": 50,
    "rank": 3,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 2,
    "event_id": 49,
    "participant_id": 2,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 3,
    "event_id": 2,
    "participant_id": 40,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 4,
    "event_id": 9,
    "participant_id": 31,
    "rank": 3,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 5,
    "event_id": 37,
    "participant_id": 14,
    "rank": 2,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 6,
    "event_id": 17,
    "participant_id": 50,
    "rank": 2,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 7,
    "event_id": 39,
    "participant_id": 39,
    "rank": 3,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 8,
    "event_id": 8,
    "participant_id": 50,
    "rank": 1,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 9,
    "event_id": 7,
    "participant_id": 38,
    "rank": 1,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 10,
    "event_id": 37,
    "participant_id": 44,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 11,
    "event_id": 46,
    "participant_id": 13,
    "rank": 1,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 12,
    "event_id": 45,
    "participant_id": 41,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 13,
    "event_id": 45,
    "participant_id": 50,
    "rank": 2,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 14,
    "event_id": 39,
    "participant_id": 8,
    "rank": 3,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 15,
    "event_id": 23,
    "participant_id": 35,
    "rank": 2,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 16,
    "event_id": 24,
    "participant_id": 5,
    "rank": 3,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 17,
    "event_id": 22,
    "participant_id": 1,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 18,
    "event_id": 7,
    "participant_id": 28,
    "rank": 2,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 19,
    "event_id": 30,
    "participant_id": 46,
    "rank": 1,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 20,
    "event_id": 12,
    "participant_id": 47,
    "rank": 3,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 21,
    "event_id": 18,
    "participant_id": 40,
    "rank": 3,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 22,
    "event_id": 30,
    "participant_id": 28,
    "rank": 3,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 23,
    "event_id": 18,
    "participant_id": 21,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 24,
    "event_id": 18,
    "participant_id": 29,
    "rank": 1,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 25,
    "event_id": 37,
    "participant_id": 40,
    "rank": 3,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 26,
    "event_id": 22,
    "participant_id": 2,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 27,
    "event_id": 12,
    "participant_id": 32,
    "rank": 1,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 28,
    "event_id": 17,
    "participant_id": 22,
    "rank": 2,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 29,
    "event_id": 45,
    "participant_id": 18,
    "rank": 3,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 30,
    "event_id": 34,
    "participant_id": 13,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 31,
    "event_id": 47,
    "participant_id": 27,
    "rank": 2,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 32,
    "event_id": 49,
    "participant_id": 16,
    "rank": 3,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 33,
    "event_id": 42,
    "participant_id": 46,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 34,
    "event_id": 2,
    "participant_id": 6,
    "rank": 2,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 35,
    "event_id": 26,
    "participant_id": 45,
    "rank": 1,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 36,
    "event_id": 43,
    "participant_id": 38,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 37,
    "event_id": 36,
    "participant_id": 34,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 38,
    "event_id": 48,
    "participant_id": 36,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 39,
    "event_id": 45,
    "participant_id": 30,
    "rank": 2,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 40,
    "event_id": 17,
    "participant_id": 15,
    "rank": 1,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 41,
    "event_id": 13,
    "participant_id": 21,
    "rank": 1,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 42,
    "event_id": 35,
    "participant_id": 49,
    "rank": 3,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 43,
    "event_id": 13,
    "participant_id": 14,
    "rank": 3,
    "prize": "Silver",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 44,
    "event_id": 18,
    "participant_id": 47,
    "rank": 3,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 45,
    "event_id": 39,
    "participant_id": 19,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 46,
    "event_id": 19,
    "participant_id": 15,
    "rank": 2,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 47,
    "event_id": 20,
    "participant_id": 1,
    "rank": 3,
    "prize": "Bronze",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 48,
    "event_id": 9,
    "participant_id": 18,
    "rank": 1,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 49,
    "event_id": 36,
    "participant_id": 19,
    "rank": 3,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  },
  {
    "id": 50,
    "event_id": 41,
    "participant_id": 49,
    "rank": 2,
    "prize": "Gold",
    "created_at": "2025-01-01T13:00:00.000Z"
  }
];

module.exports = {
  departments,
  users,
  events,
  participants,
  participation,
  results,
};
