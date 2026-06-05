import type { AdData } from "@/types/ad";

interface Edge {
  node: { collated_results?: AdData[] };
}
export const extractCollatedAds = (
  rawEdges: Edge[] | Edge | null | undefined,
) => {
  let totalOriginalAds = 0;
  const edges = Array.isArray(rawEdges) ? rawEdges : rawEdges ? [rawEdges] : [];
  const ads = edges
    .map((edge) => edge.node.collated_results ?? [])
    .filter((group) => group.length > 0)
    .map((group) => {
      totalOriginalAds += group.length;
      const maxOriginal = group.reduce(
        (max, ad) => Math.max(max, ad.collation_count ?? 0),
        0,
      );
      return {
        ...group[0],
        collation_count: Math.max(maxOriginal, group.length, 1),
      };
    });
  return { ads, searchCount: totalOriginalAds };
};
