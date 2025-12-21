// app/admin/stores-config/page.tsx

import { getStores } from "@/actions/stores";

import { StoresConfig } from "@/components/adTool/stores/stores-config";

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <div className="container mx-auto py-8">
      <StoresConfig initialStores={stores} />
    </div>
  );
}
