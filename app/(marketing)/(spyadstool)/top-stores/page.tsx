// app/admin/top-stores/page.tsx
import { Suspense } from "react";

import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";
import { TopStoresDisplay } from "@/components/adLibrary/topStores/top-stores-display";

export default async function TopStoresPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense>
        <TopStoresDisplay />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
