import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/feed/PostCard";
import { PostForm } from "@/components/feed/PostForm";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { institution: true },
  });
  if (!user) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { institutionId: user.institutionId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, image: true, dept: true, level: true } },
      likes: { select: { userId: true } },
      comments: {
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Feed</h1>
        <p className="text-sm text-muted-foreground">
          {user.institution.name} — {user.dept}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-9 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50"
          />
        </div>
        <select className="rounded-lg border border-input bg-white/50 px-3 py-2 text-sm backdrop-blur-sm dark:bg-gray-900/50">
          <option value="">All Levels</option>
          <option value="100">100 Level</option>
          <option value="200">200 Level</option>
          <option value="300">300 Level</option>
          <option value="400">400 Level</option>
          <option value="500">500 Level</option>
        </select>
      </div>

      {/* Create Post */}
      <PostForm user={user} />

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
