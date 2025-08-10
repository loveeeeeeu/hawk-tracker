import { User } from './user';
import { Workspace, Role, Permission } from './authz';

/**
 * Payload for the login request.
 */
export interface LoginPayload {
  username: string;
  password: string;
}

/**
 * Summary of a user's membership in a workspace, used for switching.
 */
export interface WorkspaceMembership {
  workspace: Pick<Workspace, 'id' | 'name' | 'type'>;
  roles: Pick<Role, 'id' | 'name'>[]; // User's roles in that workspace
}

/**
 * The `data` part of the response for a successful login.
 */
export interface LoginResponse {
  accessToken: string; // Scoped to the default/last-used workspace
  user: User;
  memberships: WorkspaceMembership[]; // List of all workspaces the user belongs to
}

/**
 * The `data` part of the response for a successful registration.
 */
export interface RegisterResponse {
  accessToken: string; // Scoped to the default/last-used workspace
  user: User;
}

/**
 * Payload for the registration request.
 */
export interface RegisterPayload {
  username: string;
  password: string;
}

/**
 * Payload for switching the active workspace.
 */
export interface SwitchWorkspacePayload {
  workspaceId: string;
}

/**
 * Response for a successful workspace switch.
 */
export interface SwitchWorkspaceResponse {
  accessToken: string; // A new token scoped to the new workspace
  permissions: Permission[]; // The user's effective, structured permissions in the new workspace
}

/**
 * Payload encoded within the JWT.
 */
export interface JwtPayload {
  userId: string;
  username: string;
  workspaceId: string; // The workspace this token is valid for
  sessionId: string;
}
