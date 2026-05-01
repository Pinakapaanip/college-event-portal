// In-memory demo data generator

const departments = ['CSE', 'AI', 'ECE', 'MECH'];
const categories = ['Technical', 'Cultural', 'Sports', 'Workshop'];

const firstNames = [
  'Aarav', 'Vivek', 'Arjun', 'Rohan', 'Ananya', 'Priya', 'Siya', 'Neha',
  'Karan', 'Rajesh', 'Amit', 'Sundar', 'Isha', 'Pooja', 'Shreya', 'Nisha',
  'Varun', 'Samir', 'Harsh', 'Aditya', 'Ravi', 'Suresh', 'Vikram', 'Nikhil',
  'Zara', 'Aaliyah', 'Diya', 'Esha', 'Farida', 'Gita', 'Hema', 'Ira',
  'John', 'Alice', 'Bob', 'Charlie', 'Diana', 'Emma', 'Frank', 'Grace',
  'Henry', 'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia',
  'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy',
];

const lastNames = [
  'Kumar', 'Singh', 'Patel', 'Gupta', 'Sharma', 'Verma', 'Rao', 'Reddy',
  'Nair', 'Menon', 'Bhat', 'Desai', 'Iyer', 'Srivastava', 'Mishra', 'Joshi',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
];

function generateEvents() {
  const events = [];
  let eventId = 1;
  const months = [
    { name: 'January', count: 3, offset: 0 },
    { name: 'February', count: 5, offset: 31 },
    { name: 'March', count: 7, offset: 59 },
    { name: 'April', count: 4, offset: 90 },
  ];

  let categoryCount = { Technical: 0, Cultural: 0, Sports: 0, Workshop: 0 };
  let deptCount = { CSE: 0, AI: 0, ECE: 0, MECH: 0 };
  const targetCat = { Technical: 15, Cultural: 10, Sports: 8, Workshop: 7 };
  const targetDept = { CSE: 12, AI: 8, ECE: 10, MECH: 5 };

  months.forEach((month) => {
    for (let i = 0; i < month.count; i++) {
      const category =
        categoryCount.Technical < targetCat.Technical
          ? 'Technical'
          : categoryCount.Cultural < targetCat.Cultural
            ? 'Cultural'
            : categoryCount.Sports < targetCat.Sports
              ? 'Sports'
              : 'Workshop';

      const dept =
        deptCount.CSE < targetDept.CSE
          ? 'CSE'
          : deptCount.AI < targetDept.AI
            ? 'AI'
            : deptCount.ECE < targetDept.ECE
              ? 'ECE'
              : 'MECH';

      categoryCount[category]++;
      deptCount[dept]++;

      const date = new Date(2026, 0, month.offset + i + 1);
      events.push({
        id: eventId++,
        title: `${category} Event - ${eventId}`,
        category,
        department: dept,
        date: date.toISOString().split('T')[0],
        venue: `Venue ${eventId}`,
        organizer: `${dept} Club`,
        image: `https://images.unsplash.com/photo-${1500000000 + eventId * 123456}?w=800`,
      });
    }
  });

  return events;
}

function generateParticipants() {
  const participants = [];
  let participantId = 1;

  for (let i = 0; i < 200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const type = Math.random() < 0.7 ? 'Internal' : 'External';
    const year = type === 'Internal' ? Math.floor(Math.random() * 4) + 1 : null;

    participants.push({
      id: participantId++,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@college.edu`,
      department,
      type,
      year,
      rollNo: type === 'Internal' ? `${department}${Math.floor(Math.random() * 999) + 1}` : null,
    });
  }

  return participants;
}

function generateParticipation(events, participants) {
  const participation = [];
  let id = 1;

  participants.forEach((participant) => {
    const numEvents = Math.floor(Math.random() * 3) + 1;
    const eventIndices = new Set();

    while (eventIndices.size < numEvents && eventIndices.size < events.length) {
      eventIndices.add(Math.floor(Math.random() * events.length));
    }

    eventIndices.forEach((eventIdx) => {
      participation.push({
        id: id++,
        participantId: participant.id,
        eventId: events[eventIdx].id,
        eventTitle: events[eventIdx].title,
      });
    });
  });

  return participation;
}

function generateResults(events) {
  const results = [];
  let resultId = 1;

  events.forEach((event) => {
    const winners = [
      { rank: 1, points: 100 },
      { rank: 2, points: 75 },
      { rank: 3, points: 50 },
    ];

    winners.forEach((winner) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      results.push({
        id: resultId++,
        eventId: event.id,
        eventTitle: event.title,
        rank: winner.rank,
        winnerName: `${firstName} ${lastName}`,
        department: departments[Math.floor(Math.random() * departments.length)],
        points: winner.points,
      });
    });
  });

  return results;
}

function generateAnalytics(events, participants, participation) {
  const totalEvents = events.length;
  const totalParticipants = participants.length;
  const totalParticipations = participation.length;

  const eventsByDepartment = {};
  events.forEach((e) => {
    eventsByDepartment[e.department] = (eventsByDepartment[e.department] || 0) + 1;
  });

  const eventsByCategory = {};
  events.forEach((e) => {
    eventsByCategory[e.category] = (eventsByCategory[e.category] || 0) + 1;
  });

  const participantsByDepartment = {};
  participants.forEach((p) => {
    participantsByDepartment[p.department] = (participantsByDepartment[p.department] || 0) + 1;
  });

  const monthlyTrend = {};
  events.forEach((e) => {
    const date = new Date(e.date);
    const month = date.toLocaleString('en-US', { month: 'short' });
    monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
  });

  const internalCount = participants.filter((p) => p.type === 'Internal').length;
  const externalCount = participants.filter((p) => p.type === 'External').length;

  return {
    totalEvents,
    totalParticipants,
    totalParticipations,
    eventsByDepartment,
    eventsByCategory,
    participantsByDepartment,
    monthlyTrend,
    participantTypeBreakdown: {
      internal: internalCount,
      external: externalCount,
    },
  };
}

// Generate all data once
const events = generateEvents();
const participants = generateParticipants();
const participation = generateParticipation(events, participants);
const results = generateResults(events);
const analytics = generateAnalytics(events, participants, participation);

module.exports = {
  events,
  participants,
  participation,
  results,
  analytics,
};
