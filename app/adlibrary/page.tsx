// /app/dashboard/adlibrary/page.tsx
import { Suspense } from "react";

import { AdBrowser } from "@/components/adLibrary/AdBrowser";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

interface SearchParams {
  pageId?: string;
}

export default function AdLibraryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const pageId = searchParams?.pageId;

  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <AdBrowser />
    </Suspense>
  );
}
