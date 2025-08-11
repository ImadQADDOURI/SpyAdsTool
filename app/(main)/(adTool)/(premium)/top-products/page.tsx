// app/admin/top-stores/page.tsx
import { Suspense } from "react";

import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";
import TopProductsDisplay from "@/components/adTool/topProducts/top-products-display";

export default async function TopProductsPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense>
        <TopProductsDisplay />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
