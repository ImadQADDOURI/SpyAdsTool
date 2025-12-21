// app/admin/stores/page.tsx
import { Suspense } from "react";

import { StoresDisplay } from "@/components/adTool/stores/stores-display";
import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";

export default async function StoresPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense>
        <StoresDisplay />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
