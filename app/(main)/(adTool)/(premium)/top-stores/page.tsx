// app/admin/top-stores/page.tsx
import { Suspense } from "react";

import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";
import { TopStoresDisplay } from "@/components/adTool/topStores/top-stores-display";

export default async function TopStoresPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense>
        <TopStoresDisplay />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
