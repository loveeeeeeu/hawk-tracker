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
