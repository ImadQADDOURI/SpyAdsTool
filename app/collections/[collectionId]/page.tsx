// app/collections/[collectionId]/page.tsx
import { CollectionDetails } from "@/components/adLibrary/collections/CollectionDetails";

interface CollectionPageProps {
  params: {
    collectionId: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <CollectionDetails collectionId={params.collectionId} />
    </div>
  );
}
