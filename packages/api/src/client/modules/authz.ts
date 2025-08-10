import { apiInstance } from '../instance';
import { Member, Role, CreateRolePayload, UpdateRolePayload } from '../../types';

export const authz = {
  /**
   * Fetches the list of members for the current workspace.
   */
  getWorkspaceMembers: (): Promise<Member[]> => {
    return apiInstance.get('/authz/members');
  },

  /**
   * Invites a new member to the current workspace.
   * @param userId - The ID of the user to invite.
   * @param roleIds - The IDs of the roles to assign.
   */
  inviteMember: (userId: string, roleIds: string[]): Promise<void> => {
    return apiInstance.post('/authz/invites', { userId, roleIds });
  },

  /**
   * Fetches all available roles in the current workspace.
   */
  getRoles: (): Promise<Role[]> => {
    return apiInstance.get('/authz/roles');
  },

  /**
   * Creates a new custom role in the current workspace.
   * @param payload - The details of the new role.
   */
  createRole: (payload: CreateRolePayload): Promise<Role> => {
    return apiInstance.post('/authz/roles', payload);
  },

  /**
   * Updates an existing custom role.
   * @param roleId - The ID of the role to update.
   * @param payload - The fields to update.
   */
  updateRole: (roleId: string, payload: UpdateRolePayload): Promise<Role> => {
    return apiInstance.patch(`/authz/roles/${roleId}`, payload);
  },

  /**
   * Deletes a custom role.
   * @param roleId - The ID of the role to delete.
   */
  deleteRole: (roleId: string): Promise<void> => {
    return apiInstance.delete(`/authz/roles/${roleId}`);
  },
};

