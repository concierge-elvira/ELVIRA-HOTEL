import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

interface OptimizedQueryConfig<TData>
  extends Omit<UseQueryOptions<TData>, "queryKey" | "queryFn"> {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
}

interface UseOptimizedQueryParams<TData> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  config?: OptimizedQueryConfig<TData>;
  logPrefix?: string;
}

/**
 * Enhanced query hook with performance logging and optimization
 * Tracks query lifecycle and provides detailed performance metrics
 */
export function useOptimizedQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  config = {},
  logPrefix = "Query",
}: UseOptimizedQueryParams<TData>): UseQueryResult<TData> {
  const startTime = performance.now();
const wrappedQueryFn = async () => {
    const fetchStartTime = performance.now();
try {
      const data = await queryFn();
      const fetchEndTime = performance.now();
return data;
    } catch (error) {
      const fetchEndTime = performance.now();
throw error;
    }
  };

  const result = useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    enabled,
    ...config,
  });

  const endTime = performance.now();
return result;
}
