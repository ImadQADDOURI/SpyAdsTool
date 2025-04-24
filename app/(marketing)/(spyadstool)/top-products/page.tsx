// app/admin/top-stores/page.tsx
import { Suspense } from "react";

import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";
import TopProductsDisplay from "@/components/adLibrary/topProducts/top-products-display";

export default async function TopProductsPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense>
        <TopProductsDisplay />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
