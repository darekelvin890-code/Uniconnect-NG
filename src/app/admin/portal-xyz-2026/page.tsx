import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { Users, BookOpen, FileText, TrendingUp, ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { institution: true },
  });

  if (!user || user.role !== Role.ADMIN) {
    redirect("/feed");
  }

  // Aggregate stats
  const [
    totalUsers,
    totalPosts,
    totalLikes,
    pendingUploads,
    totalQuizzes,
    totalAttempts,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { institutionId: user.institutionId } }),
    prisma.post.count({ where: { institutionId: user.institutionId } }),
    prisma.like.count({
      where: { post: { institutionId: user.institutionId } },
    }),
    prisma.libraryResource.count({
      where: { institutionId: user.institutionId, status: "PENDING" },
    }),
    prisma.quiz.count({ where: { institutionId: user.institutionId } }),
    prisma.quizAttempt.count({
      where: { quiz: { institutionId: user.institutionId } },
    }),
    prisma.user.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, dept: true, level: true, createdAt: true },
    }),
  ]);

  const stats = [
    { title: "Total Users", value: totalUsers, icon: Users, color: "blue" },
    { title: "Posts", value: totalPosts, icon: FileText, color: "emerald" },
    { title: "Pending Uploads", value: pendingUploads, icon: BookOpen, color: "amber" },
    { title: "Quiz Attempts", value: totalAttempts, icon: ClipboardCheck, color: "purple" },
    { title: "Quizzes Created", value: totalQuizzes, icon: TrendingUp, color: "rose" },
    { title: "Total Likes", value: totalLikes, icon: TrendingUp, color: "indigo" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">
            {user.institution.name} — Dashboard
          </p>
        </div>
        <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Admin
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <AnalyticsCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Quick Actions + Recent Users */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border border-blue-100/20 bg-white/60 p-6 backdrop-blur-xl dark:border-blue-900/20 dark:bg-gray-950/60">
          <h2 className="mb-4 font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/portal-xyz-2026/uploads"
              className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 text-center text-sm font-medium text-amber-700 transition hover:bg-amber-100/50 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-400"
            >
              {pendingUploads > 0 && (
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                  {pendingUploads}
                </span>
              )}
              Review Uploads
            </a>
            <a
              href="/admin/portal-xyz-2026/users"
              className="rounded-lg border border-blue-200/50 bg-blue-50/50 p-4 text-center text-sm font-medium text-blue-700 transition hover:bg-blue-100/50 dark:border-blue-900/30 dark:bg-blue-950/30 dark:text-blue-400"
            >
              Manage Users
            </a>
            <a
              href="/admin/portal-xyz-2026/analytics"
              className="rounded-lg border border-purple-200/50 bg-purple-50/50 p-4 text-center text-sm font-medium text-purple-700 transition hover:bg-purple-100/50 dark:border-purple-900/30 dark:bg-purple-950/30 dark:text-purple-400"
            >
              Full Analytics
            </a>
            <a
              href="/quiz"
              className="rounded-lg border border-emerald-200/50 bg-emerald-50/50 p-4 text-center text-sm font-medium text-emerald-700 transition hover:bg-emerald-100/50 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              Create Quiz
            </a>
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-xl border border-blue-100/20 bg-white/60 p-6 backdrop-blur-xl dark:border-blue-900/20 dark:bg-gray-950/60">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Registrations</h2>
            <a
              href="/admin/portal-xyz-2026/users"
              className="text-xs text-blue-600 hover:text-blue-500"
            >
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-lg bg-white/40 p-3 dark:bg-gray-900/40"
              >
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.dept} — {u.level}L
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
