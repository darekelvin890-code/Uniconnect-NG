import { PrismaClient, Role, CGPAScale } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const REAL_UNIVERSITIES = [
  { name: "University of Ibadan", slug: "ui" },
  { name: "Obafemi Awolowo University", slug: "oau" },
  { name: "University of Lagos", slug: "unilag" },
  { name: "Ahmadu Bello University, Zaria", slug: "abu" },
  { name: "University of Nigeria, Nsukka", slug: "unn" },
  { name: "University of Benin", slug: "uniben" },
  { name: "Federal University of Technology, Akure", slug: "futa" },
  { name: "Federal University of Technology, Minna", slug: "futminna" },
  { name: "University of Ilorin", slug: "unilorin" },
  { name: "Lagos State University", slug: "lasu" },
  { name: "University of Calabar", slug: "unical" },
  { name: "Nnamdi Azikiwe University, Awka", slug: "unizik" },
  { name: "Bayero University, Kano", slug: "buk" },
  { name: "University of Port Harcourt", slug: "uniport" },
  { name: "Federal University of Agriculture, Abeokuta", slug: "funaab" },
  { name: "University of Jos", slug: "unijos" },
  { name: "Abubakar Tafawa Balewa University, Bauchi", slug: "atbu" },
  { name: "University of Uyo", slug: "uniuyo" },
  { name: "Rivers State University", slug: "rsu" },
  { name: "Enugu State University of Science and Technology", slug: "esut" },
  { name: "Delta State University, Abraka", slug: "delsu" },
  { name: "Ekiti State University", slug: "eksu" },
  { name: "Ambrose Alli University, Ekpoma", slug: "aau" },
  { name: "Benue State University, Makurdi", slug: "bsu" },
  { name: "Federal University of Technology, Owerri", slug: "futo" },
  { name: "University of Maiduguri", slug: "unimaid" },
  { name: "Usmanu Danfodiyo University, Sokoto", slug: "udusok" },
  { name: "Nasarawa State University, Keffi", slug: "nsuk" },
  { name: "Olabisi Onabanjo University, Ago-Iwoye", slug: "oou" },
  { name: "Covenant University, Ota", slug: "covenant" },
];

function generatePlaceholderUniversities(count: number) {
  const types = ["Federal University", "State University", "University"];
  const prefixes = [
    "New Era", "Harmony", "Summit", "Heritage", "Prestige",
    "Meridian", "Apex", "Pioneer", "Legacy", "Triumph",
    "Royal", "Imperial", "Crown", "Noble", "Excel",
    "Phoenix", "Rising", "Prime", "Elite", "Vanguard",
    "Cardinal", "Century", "Global", "Standard", "United",
    "Continental", "Nova", "Titan", "Fusion", "Vertex",
  ];
  const suffixes = [
    "of Technology", "of Science", "of Education",
    "of Arts & Sciences", "of Management", "of Health Sciences",
    "of Agriculture", "of Humanities", "of Innovation",
  ];
  const locations = [
    "Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt",
    "Enugu", "Kaduna", "Benin City", "Owerri", "Aba",
    "Jos", "Ilorin", "Abeokuta", "Sokoto", "Maiduguri",
    "Calabar", "Akure", "Minna", "Uyo", "Bauchi",
    "Makurdi", "Yola", "Zaria", "Warri", "Asaba",
    "Ado-Ekiti", "Lafia", "Gusau", "Katsina", "Damaturu",
  ];

  const result: { name: string; slug: string }[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[i % suffixes.length];
    const location = locations[i % locations.length];
    const name = `${prefix} ${type} ${suffix}, ${location}`;
    const slug = `placeholder-${i + 1}`;
    result.push({ name, slug });
  }
  return result;
}

async function main() {
  console.log("🌱 Seeding UniConnect NG...");

  // Clear existing data
  await prisma.cGPARecord.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.libraryResource.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  // Create institutions: 30 real + 230 placeholder = 260
  const allInstitutions = [
    ...REAL_UNIVERSITIES,
    ...generatePlaceholderUniversities(230),
  ];

  for (const inst of allInstitutions) {
    await prisma.institution.create({
      data: { name: inst.name, slug: inst.slug },
    });
  }
  console.log(`✅ Created ${allInstitutions.length} institutions`);

  // Fetch UI and UNILAG for sample data
  const ui = await prisma.institution.findUnique({ where: { slug: "ui" } })!;
  const unilag = await prisma.institution.findUnique({ where: { slug: "unilag" } })!;
  const covenant = await prisma.institution.findUnique({ where: { slug: "covenant" } })!;

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@uniconnect.ng",
      password: adminPassword,
      matric: "ADMIN/001",
      level: 500,
      dept: "Computer Science",
      role: Role.ADMIN,
      institutionId: ui!.id,
    },
  });
  console.log(`✅ Created admin: ${admin.email}`);

  // Create sample students
  const studentPassword = await bcrypt.hash("Student@123", 12);
  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: "Chidi Okonkwo",
        email: "chidi@example.com",
        password: studentPassword,
        matric: "UI/2024/001",
        level: 300,
        dept: "Computer Science",
        institutionId: ui!.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Amara Okafor",
        email: "amara@example.com",
        password: studentPassword,
        matric: "UI/2024/002",
        level: 200,
        dept: "Electrical Engineering",
        institutionId: ui!.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Tunde Balogun",
        email: "tunde@example.com",
        password: studentPassword,
        matric: "UNILAG/2024/001",
        level: 400,
        dept: "Mechanical Engineering",
        institutionId: unilag!.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Kemi Adesina",
        email: "kemi@example.com",
        password: studentPassword,
        matric: "UNILAG/2024/002",
        level: 100,
        dept: "Mass Communication",
        institutionId: unilag!.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "David Eze",
        email: "david@example.com",
        password: studentPassword,
        matric: "COV/2024/001",
        level: 300,
        dept: "Computer Science",
        institutionId: covenant!.id,
      },
    }),
  ]);
  console.log(`✅ Created ${students.length} sample students`);

  // Sample posts (UI feed)
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content:
          "📢 CS Departmental meeting tomorrow at 10am in the LT2. We'll be discussing the final year project timelines and internship opportunities. All 300-500 level students must attend.",
        authorId: admin.id,
        institutionId: ui!.id,
        dept: "Computer Science",
        level: 300,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Does anyone have past questions for CSC 301 (Data Structures)? I've checked the library but couldn't find anything recent. Would really appreciate if someone could share! 🙏",
        authorId: students[0].id,
        institutionId: ui!.id,
        dept: "Computer Science",
        level: 300,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Just uploaded my CSC 201 notes to the library — covers Arrays, Linked Lists, and Recursion. Check them out! Link in the library section.",
        authorId: students[1].id,
        institutionId: ui!.id,
        dept: "Computer Science",
        level: 200,
      },
    }),
  ]);
  console.log(`✅ Created ${posts.length} sample posts`);

  // Likes & comments
  await prisma.like.create({
    data: { userId: students[0].id, postId: posts[0].id },
  });
  await prisma.like.create({
    data: { userId: students[1].id, postId: posts[0].id },
  });
  await prisma.comment.create({
    data: {
      content: "I'll be there. Any updates on the internship list?",
      userId: students[0].id,
      postId: posts[0].id,
    },
  });
  await prisma.comment.create({
    data: {
      content: "I have the 2023 past questions! I'll upload them to the library now.",
      userId: students[2].id,
      postId: posts[1].id,
    },
  });

  // Sample library resources
  await prisma.libraryResource.create({
    data: {
      title: "CSC 201 - Data Structures Lecture Notes",
      description: "Comprehensive notes covering Arrays, Linked Lists, Stacks, Queues, and Recursion with code examples in Python.",
      fileUrl: "https://utfs.io/f/sample-csc201-notes.pdf",
      fileType: "PDF",
      fileSize: 2_400_000,
      course: "CSC 201",
      dept: "Computer Science",
      level: 200,
      institutionId: ui!.id,
      uploaderId: admin.id,
      status: "APPROVED",
      approvedById: admin.id,
    },
  });
  await prisma.libraryResource.create({
    data: {
      title: "CSC 301 - Data Structures Past Questions (2022-2024)",
      description: "Compiled past questions from the last 3 sessions with solutions.",
      fileUrl: "https://utfs.io/f/sample-csc301-pq.pdf",
      fileType: "PDF",
      fileSize: 3_100_000,
      course: "CSC 301",
      dept: "Computer Science",
      level: 300,
      institutionId: ui!.id,
      uploaderId: students[0].id,
      status: "PENDING",
    },
  });

  // Sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "CSC 201 Mid-Semester Revision",
      description: "20 questions covering Arrays, Linked Lists, and Recursion. You have 30 minutes.",
      institutionId: ui!.id,
      timeLimit: 30,
      createdById: admin.id,
    },
  });
  await prisma.question.createMany({
    data: [
      {
        quizId: quiz.id,
        text: "What is the time complexity of accessing an element in an array by index?",
        options: JSON.stringify([
          "A. O(1)",
          "B. O(log n)",
          "C. O(n)",
          "D. O(n²)",
        ]),
        correctAnswer: 0,
        order: 1,
      },
      {
        quizId: quiz.id,
        text: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: JSON.stringify([
          "A. Queue",
          "B. Stack",
          "C. Linked List",
          "D. Tree",
        ]),
        correctAnswer: 1,
        order: 2,
      },
      {
        quizId: quiz.id,
        text: "In a singly linked list, each node contains:",
        options: JSON.stringify([
          "A. Data only",
          "B. Data and pointer to previous node",
          "C. Data and pointer to next node",
          "D. Pointer to next node only",
        ]),
        correctAnswer: 2,
        order: 3,
      },
      {
        quizId: quiz.id,
        text: "What is the base case in recursion?",
        options: JSON.stringify([
          "A. The recursive call itself",
          "B. The condition that stops the recursion",
          "C. The parameter passed to the function",
          "D. The return value of the function",
        ]),
        correctAnswer: 1,
        order: 4,
      },
      {
        quizId: quiz.id,
        text: "Which of the following is NOT a linear data structure?",
        options: JSON.stringify([
          "A. Array",
          "B. Queue",
          "C. Tree",
          "D. Stack",
        ]),
        correctAnswer: 2,
        order: 5,
      },
    ],
  });

  // Sample quiz attempt
  await prisma.quizAttempt.create({
    data: {
      userId: students[0].id,
      quizId: quiz.id,
      score: 4,
      total: 5,
      answers: JSON.stringify([
        { questionId: quiz.id, selectedOption: 0, isCorrect: true },
        { questionId: quiz.id, selectedOption: 1, isCorrect: true },
        { questionId: quiz.id, selectedOption: 2, isCorrect: true },
        { questionId: quiz.id, selectedOption: 1, isCorrect: true },
        { questionId: quiz.id, selectedOption: 2, isCorrect: true },
      ]),
    },
  });

  // Sample CGPA records
  await prisma.cGPARecord.create({
    data: {
      userId: students[0].id,
      institutionId: ui!.id,
      semester: "2024/2025 - First Semester",
      level: 300,
      scale: "SCALE_5_0",
      courses: JSON.stringify([
        { code: "CSC 301", name: "Data Structures", units: 3, score: 82, grade: "A", gradePoint: 5.0 },
        { code: "CSC 303", name: "Computer Architecture", units: 3, score: 71, grade: "A", gradePoint: 5.0 },
        { code: "MAT 301", name: "Linear Algebra", units: 3, score: 65, grade: "B", gradePoint: 4.0 },
        { code: "GST 301", name: "Entrepreneurship", units: 2, score: 58, grade: "C", gradePoint: 3.0 },
        { code: "PHY 301", name: "Electromagnetism", units: 3, score: 48, grade: "D", gradePoint: 2.0 },
        { code: "CSC 311", name: "Software Engineering", units: 2, score: 74, grade: "A", gradePoint: 5.0 },
      ]),
      gpa: 4.19,
      cgpa: 4.19,
      totalUnits: 16,
    },
  });

  console.log("✅ Seed complete! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
