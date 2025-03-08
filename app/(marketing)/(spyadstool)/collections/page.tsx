import { Suspense } from "react";

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { UserCollections } from "@/components/adLibrary/UserCollections";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <UserCollections />
    </Suspense>
  );
}
