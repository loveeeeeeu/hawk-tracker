/**
 * Defines the structure of a user object.
 */
export interface User {
  /**
   * The unique identifier for the user.
   */
  id: number;

  /**
   * The user's name.
   */
  name: string;

  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's roles.
   */
  roles: string[];
}
