import { User } from "./user.js";

/**
 * Payload for the login request.
 */
export interface LoginPayload {
  /**
   * The user's username.
   */
  username: string;

  /**
   * The user's password.
   */
  password: string;
}

/**
 * Payload for the register request.
 */
export interface RegisterPayload {
  /**
   * The user's username.
   */
  username: string;

  /**
   * The user's password.
   */
  password: string;

  /**
   * The user's password check.
   */
  checkPassword: string;
}

/**
 * Response for the login request.
 */
export interface LoginResponse {
  /**
   * The user's access token.
   */
  accessToken: string;

  /**
   * The user's basic information.
   */
  user: User;
}
