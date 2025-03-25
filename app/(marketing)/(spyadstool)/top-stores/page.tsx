// app/admin/top-stores/page.tsx
import { Suspense } from "react";
import { getTopStores } from "@/actions/top-stores";

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";
import { TopStoresDisplay } from "@/components/adLibrary/topStores/top-stores-display";

export default async function TopStoresPage() {
  const stores = await getTopStores();
  return (
    <SubscriptionPageGuard>
      <Suspense fallback={<TopStoresDisplay stores={[]} isLoading />}>
        <TopStoresDisplay stores={stores} />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
