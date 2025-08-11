// app/admin/top-stores-config/page.tsx

import { getTopStores } from "@/actions/top-stores";

import { TopStoresConfig } from "@/components/adLibrary/topStores/top-stores-config";

export default async function TopStoresPage() {
  const stores = await getTopStores();

  return (
    <div className="container mx-auto py-8">
      <TopStoresConfig initialStores={stores} />
    </div>
  );
}
