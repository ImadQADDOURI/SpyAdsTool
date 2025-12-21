// app/admin/products/page.tsx
import { Suspense } from "react";

import ProductsDisplay from "@/components/adTool/products/products-display";
import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";

export default async function ProductsPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense>
        <ProductsDisplay />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
