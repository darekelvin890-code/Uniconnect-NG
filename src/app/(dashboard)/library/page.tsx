import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResourceCard } from "@/components/library/ResourceCard";
import { CategoryFilter } from "@/components/library/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { institution: true },
  });
  if (!user) redirect("/login");

  // Show APPROVED resources + user's own PENDING ones
  const resources = await prisma.libraryResource.findMany({
    where: {
      institutionId: user.institutionId,
      OR: [
        { status: "APPROVED" },
        { status: "PENDING", uploaderId: user.id },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true, image: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-sm text-muted-foreground">
            Notes, past questions, and study materials — {user.institution.name}
          </p>
        </div>
        <Link href="/library/upload">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Resource
          </Button>
        </Link>
      </div>

      {/* Category Filters */}
      <CategoryFilter
        departments={["Computer Science", "Engineering", "Medicine", "Law", "Business Admin"]}
        levels={[100, 200, 300, 400, 500]}
      />

      {/* Resource Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed p-12 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">No resources yet. Upload the first one!</p>
          </div>
        ) : (
          resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} userId={user.id} />
          ))
        )}
      </div>
    </div>
  );
}
