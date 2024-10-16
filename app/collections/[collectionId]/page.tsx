// app/collections/[collectionId]/page.tsx
import { Suspense } from "react";

import { CollectionDetails } from "@/components/adLibrary/collections/CollectionDetails";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

interface CollectionPageProps {
  params: {
    collectionId: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <CollectionDetails collectionId={params.collectionId} />
    </Suspense>
  );
}
