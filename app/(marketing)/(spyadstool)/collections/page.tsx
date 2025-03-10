import { Suspense } from "react";

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";
import { UserCollections } from "@/components/adLibrary/UserCollections";

export default function CollectionsPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense
        fallback={<Loading message="Loading content..." size="large" />}
      >
        <UserCollections />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
