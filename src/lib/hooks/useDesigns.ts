import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetchDesignsPaginated, Design } from '../supabase/designs';

interface UseDesignsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  enabled?: boolean;
}

interface UseDesignsReturn {
  data: Design[];
  count: number;
  hasMore: boolean;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const fetcher = async (key: string) => {
  const [, page, pageSize, category] = key.split('|');
  return fetchDesignsPaginated(
    parseInt(page) || 1,
    parseInt(pageSize) || 20,
    category === 'undefined' ? undefined : category
  );
};

export const useDesigns = ({
  page = 1,
  pageSize = 20,
  category,
  enabled = true
}: UseDesignsOptions = {}): UseDesignsReturn => {
  const key = enabled ? `designs|${page}|${pageSize}|${category}` : null;
  
  const { data, error, mutate } = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    data: data?.data || [],
    count: data?.count || 0,
    hasMore: data?.hasMore || false,
    isLoading: !error && !data,
    error,
    mutate
  };
};

// Hook for infinite loading
export const useInfiniteDesigns = ({
  pageSize = 20,
  category,
  enabled = true
}: Omit<UseDesignsOptions, 'page'> = {}) => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    return `designs|${pageIndex + 1}|${pageSize}|${category}`;
  };

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    enabled ? getKey : () => null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  const designs = data ? data.flatMap(page => page.data) : [];
  const hasMore = data ? data[data.length - 1]?.hasMore : false;
  const totalCount = data ? data[0]?.count : 0;

  return {
    data: designs,
    count: totalCount,
    hasMore,
    isLoading: !error && !data,
    isLoadingMore: isValidating && data && data.length > 0,
    error,
    loadMore: () => setSize(size + 1),
    mutate
  };
};