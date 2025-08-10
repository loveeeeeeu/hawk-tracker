import { User } from './user';

/**
 * Defines the type of a permission, useful for UI logic.
 */
export enum PermissionType {
  API_ROUTER = 0,
  UI_ELEMENT = 1,
}

/**
 * Defines the action of a permission.
 */
export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  ALL = 'all',
}
/**
 * A structured permission object.
 */
export interface Permission {
  id: string; // Unique identifier, e.g., "app:create"
  description: string;
  action: PermissionAction; // The verb, e.g., "create", "read", "delete"
  subject: string; // The noun, e.g., "application", "member"
  type: PermissionType; // The type of resource this permission protects
}

export interface Role {
  id: string;
  name: string; // Generic string to support custom roles
  description: string;
  permissions: Permission[]; // A role contains a list of detailed permission objects
  type: 'SYSTEM' | 'CUSTOM'; // System roles are built-in, custom are user-defined
  parentId?: string; // Optional ID of the role this role inherits permissions from
}

// Payload for creating a new custom role
export interface CreateRolePayload {
  name: string;
  description: string;
  permissionIds: string[]; // Pass only the IDs of the permissions
  parentId?: string;
}

// Payload for updating a custom role
export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissionIds?: string[]; // Pass only the IDs of the permissions
  parentId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  type: 'PERSONAL' | 'ORGANIZATION';
  ownerId: string;
  createdAt: number;
}

export interface Member {
  userId: User;
  roles: Role[]; // A user can have multiple roles within a workspace
  joinedAt: number;
}
