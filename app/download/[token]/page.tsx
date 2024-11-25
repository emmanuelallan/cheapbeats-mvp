import { redirect } from "next/navigation";
import { DownloadCard } from "@/components/purchases/download-card";
import prisma from "@/lib/prisma";

interface DownloadPageProps {
  params: {
    token: string;
  };
}

async function getDownloadData(token: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
    include: {
      beat: true,
      addons: true,
    },
  });

  if (!purchase) {
    return null;
  }

  // Check if download link has expired
  if (new Date() > purchase.expiresAt) {
    return { expired: true };
  }

  return purchase;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const purchase = await getDownloadData(params.token);

  if (!purchase) {
    redirect("/404");
  }

  if ("expired" in purchase) {
    return (
      <div className="container max-w-3xl py-12">
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          This download link has expired.
        </div>
      </div>
    );
  }

  return (
    <main className="container max-w-3xl py-12">
      <DownloadCard purchase={purchase} />
    </main>
  );
}