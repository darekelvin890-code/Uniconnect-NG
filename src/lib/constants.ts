export const LEVELS = [100, 200, 300, 400, 500, 600];

export const GRADES_5_0: [string, number, number, number][] = [
  ["A", 70, 100, 5.0],
  ["B", 60, 69, 4.0],
  ["C", 50, 59, 3.0],
  ["D", 45, 49, 2.0],
  ["E", 40, 44, 1.0],
  ["F", 0, 39, 0.0],
];

export const GRADES_4_0: [string, number, number, number][] = [
  ["A", 70, 100, 4.0],
  ["B", 60, 69, 3.0],
  ["C", 50, 59, 2.0],
  ["D", 45, 49, 1.0],
  ["F", 0, 44, 0.0],
];

export const GRADE_SCALES: Record<string, [string, number, number, number][]> = {
  "5.0": GRADES_5_0,
  "4.0": GRADES_4_0,
};

export const FILE_TYPES = [
  { value: "PDF", label: "PDF" },
  { value: "DOCX", label: "Word (DOCX)" },
  { value: "PPTX", label: "PowerPoint (PPTX)" },
  { value: "JPG", label: "Image (JPG)" },
  { value: "PNG", label: "Image (PNG)" },
] as const;

export const DEPARTMENTS = [
  "Computer Science",
  "Cyber security",
  "Data Science",
  "Information Communication Technology",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Medicine & Surgery",
  "Pharmacy",
  "Nursing",
  "Law",
  "Business Administration",
  "Accounting",
  "Economics",
  "Mass Communication",
  "Political Science",
  "Psychology",
  "Biochemistry",
  "Microbiology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English & Literary Studies",
  "History & International Studies",
  "Philosophy",
  "Religious Studies",
  "Architecture",
  "Estate Management",
  "Quantity Surveying",
  "Geography",
  "Geology",
  "Agriculture",
];
