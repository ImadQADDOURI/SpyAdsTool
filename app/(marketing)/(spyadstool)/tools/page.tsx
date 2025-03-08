import { Suspense } from "react";

import AffiliateMarketingCalculator from "@/components/adLibrary/calculator/AffiliateMarketingCalculator";
import CODCalculator from "@/components/adLibrary/calculator/CODCalculator";
import CPACalculator from "@/components/adLibrary/calculator/CPACalculator";
import DropshippingCalculator from "@/components/adLibrary/calculator/DropshippingCalculator";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <CODCalculator />

      <DropshippingCalculator />

      <CPACalculator />

      <AffiliateMarketingCalculator />
    </Suspense>
  );
}
