import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Timer, Trophy, ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { institution: true },
  });
  if (!user) redirect("/login");

  const quizzes = await prisma.quiz.findMany({
    where: { institutionId: user.institutionId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true, attempts: true } },
      createdBy: { select: { name: true } },
    },
  });

  // Get user's completed quizzes for status tracking
  const userAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    select: { quizId: true, score: true, total: true },
  });
  const attemptedMap = new Map(userAttempts.map((a) => [a.quizId, a]));

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Quiz Arena</h1>
        <p className="text-sm text-muted-foreground">
          Test your knowledge with MCQ-based quizzes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card flex items-center gap-3 rounded-xl border border-blue-100/20 bg-white/60 p-4 backdrop-blur-xl dark:border-blue-900/20 dark:bg-gray-950/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{quizzes.length}</p>
            <p className="text-xs text-muted-foreground">Available Quizzes</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 rounded-xl border border-blue-100/20 bg-white/60 p-4 backdrop-blur-xl dark:border-blue-900/20 dark:bg-gray-950/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{userAttempts.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 rounded-xl border border-blue-100/20 bg-white/60 p-4 backdrop-blur-xl dark:border-blue-900/20 dark:bg-gray-950/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {quizzes.reduce((acc, q) => acc + q.timeLimit, 0)}m
            </p>
            <p className="text-xs text-muted-foreground">Total Quiz Time</p>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quizzes.map((quiz) => {
          const attempt = attemptedMap.get(quiz.id);
          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              attempted={!!attempt}
              score={attempt?.score}
              total={attempt?.total}
            />
          );
        })}
      </div>
    </div>
  );
}
