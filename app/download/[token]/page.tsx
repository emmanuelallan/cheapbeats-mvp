import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileAudio, FileMusic, FolderArchive } from "lucide-react";

async function getDownloadData(token: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
    include: {
      beat: true,
      addons: true,
    },
  });

  if (!purchase || purchase.expiresAt < new Date() || purchase.isDownloaded) {
    return null;
  }

  return purchase;
}

export default async function DownloadPage({
  params: { token },
}: {
  params: { token: string };
}) {
  const purchase = await getDownloadData(token);

  if (!purchase) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Download Your Files</CardTitle>
          <CardDescription>
            Your purchase of {purchase.beat.title} is ready for download
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <FileAudio className="h-8 w-8" />
                <div className="flex-1">
                  <h3 className="font-semibold">WAV File</h3>
                  <p className="text-sm text-muted-foreground">
                    High quality WAV format
                  </p>
                </div>
                <Button asChild>
                  <a href={purchase.beat.wavUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download WAV
                  </a>
                </Button>
              </div>
            </div>

            {purchase.addons.map((addon) => (
              <div key={addon.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  {addon.type === "STEMS" ? (
                    <FolderArchive className="h-8 w-8" />
                  ) : (
                    <FileMusic className="h-8 w-8" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {addon.type === "STEMS" ? "Stem Files" : "MIDI File"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {addon.type === "STEMS"
                        ? "Individual track stems (ZIP)"
                        : "MIDI arrangement file"}
                    </p>
                  </div>
                  <Button asChild>
                    <a href={addon.downloadUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download {addon.type === "STEMS" ? "Stems" : "MIDI"}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              These download links will expire on{" "}
              {purchase.expiresAt.toLocaleDateString()}. Please download your
              files before then.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
