type GradeEntry = [string, number, number, number]; // [grade, min, max, gradePoint]

interface CourseInput {
  code: string;
  name: string;
  units: number;
  score: number;
}

interface GPAOutput {
  gpa: number;
  totalGradePoints: number;
  totalUnits: number;
  gradePoints: { course: string; units: number; grade: string; gp: number }[];
}

export function calculateGPA(courses: CourseInput[], gradeScale: GradeEntry[]): GPAOutput {
  const gradePoints = courses.map((course) => {
    const entry = gradeScale.find(
      ([_grade, min, max]) => course.score >= min && course.score <= max
    );
    const grade = entry ? entry[0] : "F";
    const gp = entry ? entry[3] : 0;
    return {
      course: course.code || course.name || "Untitled",
      units: course.units,
      grade,
      gp,
    };
  });

  const totalUnits = gradePoints.reduce((sum, c) => sum + c.units, 0);
  const totalGradePoints = gradePoints.reduce((sum, c) => sum + c.gp * c.units, 0);
  const gpa = totalUnits > 0 ? Math.round((totalGradePoints / totalUnits) * 100) / 100 : 0;

  return { gpa, totalGradePoints, totalUnits, gradePoints };
}

export function calculateCGPA(
  semesterResults: { gpa: number; totalUnits: number }[]
): number {
  const totalUnits = semesterResults.reduce((sum, s) => sum + s.totalUnits, 0);
  const totalGradePoints = semesterResults.reduce(
    (sum, s) => sum + s.gpa * s.totalUnits,
    0
  );
  return totalUnits > 0
    ? Math.round((totalGradePoints / totalUnits) * 100) / 100
    : 0;
}
