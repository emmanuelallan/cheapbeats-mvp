import { Suspense } from "react";
import { BeatTable } from "@/components/beats/beatTable";
import { Card, CardContent } from "@/components/ui/card";
import { getBeats } from "@/actions/beats";
import { AdminControls } from "@/components/layout/adminControl";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function AdminPage() {
  const queryClient = new QueryClient();

  // Prefetch the beats query on the server
  await queryClient.prefetchQuery({
    queryKey: ["beats"],
    queryFn: getBeats,
  });

  const { beats = [] } = await getBeats();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="space-y-4">
          <AdminControls />
          <Suspense fallback={<div>Loading...</div>}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <BeatTable initialBeats={beats} />
            </HydrationBoundary>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
