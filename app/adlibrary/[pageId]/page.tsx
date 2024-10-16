// app/dashboard/ad-library/[pageId]/page.tsx
import { Suspense } from "react";

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import PageAdBrowser from "@/components/adLibrary/PageAdBrowser";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default function PageAdLibraryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <PageAdBrowser pageId={params.pageId} />
    </Suspense>
  );
}
