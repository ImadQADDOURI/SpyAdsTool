import { Suspense } from "react";

import { UserCollections } from "@/components/adLibrary/collections/UserCollections";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <UserCollections />
    </Suspense>
  );
}
