"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Download, Calculator } from "lucide-react";
import { ScaleSelector } from "@/components/cgpa/ScaleSelector";
import { ResultCard } from "@/components/cgpa/ResultCard";
import { GRADE_SCALES } from "@/lib/constants";
import { calculateGPA, calculateCGPA } from "@/lib/cgpa";

interface Course {
  id: string;
  code: string;
  name: string;
  units: number;
  score: number;
}

export default function CGPACalculatorPage() {
  const [scale, setScale] = useState<"4.0" | "5.0">("5.0");
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", code: "", name: "", units: 3, score: 0 },
  ]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: crypto.randomUUID(), code: "", name: "", units: 3, score: 0 },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const gradeScale = GRADE_SCALES[scale];
  const result = calculateGPA(courses, gradeScale);
  const totalUnits = courses.reduce((sum, c) => sum + Number(c.units || 0), 0);

  const exportPDF = useCallback(() => {
    // Will integrate with jsPDF or html2canvas
    // Placeholder for the export handler
    window.print();
  }, [courses, result, scale]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CGPA Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Calculate your GPA and CGPA for 4.0 or 5.0 scale
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportPDF}>
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calculator Form */}
        <div className="lg:col-span-2 space-y-4">
          <ScaleSelector scale={scale} onScaleChange={setScale} />

          {/* Course Table Header */}
          <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
            <div className="col-span-2">Code</div>
            <div className="col-span-3">Course Name</div>
            <div className="col-span-2 text-center">Units</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Grade</div>
            <div className="col-span-1" />
          </div>

          {/* Course Rows */}
          {courses.map((course) => {
            const gpEntry = gradeScale.find(
              ([_grade, min, max]) => course.score >= min && course.score <= max
            );
            const grade = gpEntry ? gpEntry[0] : "-";
            const gp = gpEntry ? gpEntry[3] : 0;

            return (
              <div
                key={course.id}
                className="grid grid-cols-12 gap-2 rounded-lg border border-blue-100/20 bg-white/50 p-3 backdrop-blur-sm dark:border-blue-900/20 dark:bg-gray-950/50"
              >
                <Input
                  className="col-span-2 h-9 text-sm"
                  placeholder="CSC301"
                  value={course.code}
                  onChange={(e) => updateCourse(course.id, "code", e.target.value)}
                />
                <Input
                  className="col-span-3 h-9 text-sm"
                  placeholder="Course name"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                />
                <Input
                  type="number"
                  className="col-span-2 h-9 text-center text-sm"
                  min={1}
                  max={6}
                  value={course.units}
                  onChange={(e) =>
                    updateCourse(course.id, "units", parseInt(e.target.value) || 0)
                  }
                />
                <Input
                  type="number"
                  className="col-span-2 h-9 text-center text-sm"
                  min={0}
                  max={100}
                  value={course.score}
                  onChange={(e) =>
                    updateCourse(course.id, "score", parseInt(e.target.value) || 0)
                  }
                />
                <div className="col-span-2 flex items-center justify-center text-sm font-semibold">
                  {grade}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({gp.toFixed(1)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-1 h-9 w-9"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            );
          })}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={addCourse}
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <ResultCard
            gpa={result.gpa}
            totalUnits={totalUnits}
            totalGradePoints={result.totalGradePoints}
            scale={scale}
            gradePoints={result.gradePoints}
          />

          <Card className="border-blue-100/20 bg-white/60 backdrop-blur-xl dark:border-blue-900/20 dark:bg-gray-950/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calculator className="h-4 w-4" />
                Grade Scale Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              {gradeScale.map(([grade, min, max, gp]) => (
                <div key={grade} className="flex justify-between">
                  <span>
                    {grade}: {min}–{max}
                  </span>
                  <span className="font-mono">{gp.toFixed(1)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
