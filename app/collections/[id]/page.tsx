// app/dashboard/collections/[id]/page.tsx

import { notFound } from "next/navigation";
import { getCollectionById } from "@/actions/collectionActions";

import { CollectionAdsDisplay } from "@/components/adLibrary/adCollections/CollectionAdsDisplay";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const result = await getCollectionById(params.id);

  if (!result.success || !result.collection) {
    notFound();
  }

  return <CollectionAdsDisplay collection={result.collection} />;
}
