import { apiInstance } from './instance';
import { PaginationPayload, PaginatedResponse } from '../types';

/**
 * A higher-order function to create a paginated API endpoint.
 * It augments the response with a `.next()` method for easy pagination.
 * @param endpoint The API endpoint to fetch data from.
 */
export const createPaginatedApi = <T, P extends PaginationPayload = PaginationPayload>(endpoint: string) => {
  const getPage = async (params: P): Promise<PaginatedResponse<T>> => {
    // The server response will not have the `next` method
    const response: Omit<PaginatedResponse<T>, 'next'> = await apiInstance.get(endpoint, { params });

    const hasNextPage = response.page * response.pageSize < response.total;

    return {
      ...response,
      // Conditionally add the .next() method if there is a next page
      next: hasNextPage
        ? () => getPage({ ...params, page: params.page + 1 } as P)
        : undefined,
    };
  };
  return getPage;
};
