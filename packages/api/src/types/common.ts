/**
 * Defines the standard API response wrapper from the server.
 * @template T - The type of the data payload in the response.
 */
export interface BaseResponse<T> {
  /**
   * The biz status code of the response.
   * 0 means success, other values means failure.
   */
  status: number;
  /**
   * The message of the response.
   */
  msg: string;
  /**
   * The data payload of the response.
   */
  data: T;
}

/**
 * Defines the structure for pagination query parameters.
 */
export interface PaginationPayload {
    page: number;
    pageSize: number;
}

/**
 * Defines the structure for a paginated API response.
 * @template T The type of the items in the list.
 */
export interface PaginatedResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    /**
     * A function to fetch the next page of results.
     * Is undefined if there are no more pages.
     */
    next?: () => Promise<PaginatedResponse<T>>;
}
