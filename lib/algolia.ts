import { algoliasearch } from "algoliasearch";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

// Initialize the Algolia client
export const algoliaClient = algoliasearch(appId, searchKey);

// Index name for products (matches Algolia dashboard)
export const PRODUCTS_INDEX = "LuckyBeePress Products";

export interface AlgoliaProductHit {
  objectID: string;
  name: string;
  sku: string;
  category: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  wholesalePrice?: number;
  retailPrice?: number;
  hasBoxOption?: boolean;
  boxWholesalePrice?: number;
  status?: string;
  inventory?: number;
  tags?: string[];
}

export async function searchProducts(
  query: string,
  options?: {
    hitsPerPage?: number;
    page?: number;
    filters?: string;
  }
): Promise<{
  hits: AlgoliaProductHit[];
  nbHits: number;
  nbPages: number;
  page: number;
}> {
  if (!query.trim()) {
    return { hits: [], nbHits: 0, nbPages: 0, page: 0 };
  }

  try {
    const result = await algoliaClient.searchSingleIndex({
      indexName: PRODUCTS_INDEX,
      searchParams: {
        query,
        hitsPerPage: options?.hitsPerPage ?? 20,
        page: options?.page ?? 0,
        filters: options?.filters,
        attributesToRetrieve: [
          "objectID",
          "name",
          "sku",
          "category",
          "slug",
          "images",
          "hasBoxOption",
          "boxWholesalePrice",
          "inventory",
          "status",
        ],
        // Search in name, sku, and category
        restrictSearchableAttributes: ["name", "sku", "category"],
      },
    });

    return {
      hits: result.hits as AlgoliaProductHit[],
      nbHits: result.nbHits ?? 0,
      nbPages: result.nbPages ?? 0,
      page: result.page ?? 0,
    };
  } catch (error) {
    console.error("Algolia search error:", error);
    return { hits: [], nbHits: 0, nbPages: 0, page: 0 };
  }
}
