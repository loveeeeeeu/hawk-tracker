import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  SwitchWorkspacePayload,
  SwitchWorkspaceResponse,
} from '@/types/auth';
import { User } from '@/types/user';
import {
  apiInstance,
  clearAccessToken,
  setAccessToken,
} from '@/client/instance';

export const auth = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiInstance.post<LoginResponse>(
      '/auth/login',
      payload,
    );
    setAccessToken(data.accessToken);
    return data;
  },
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiInstance.post<RegisterResponse>(
      '/auth/register',
      payload,
    );
    setAccessToken(data.accessToken);
    return data;
  },
  logout: async () => {
    await apiInstance.post('/auth/logout');
    clearAccessToken();
  },
  switchWorkspace: async (
    payload: SwitchWorkspacePayload,
  ): Promise<SwitchWorkspaceResponse> => {
    const switchResponse: SwitchWorkspaceResponse = await apiInstance.post(
      '/auth/switch-workspace',
      payload,
    );
    setAccessToken(switchResponse.accessToken);
    return switchResponse;
  },
  getProfile: async (): Promise<User> => {
    const { data } = await apiInstance.get('/users/profile');
    return data;
  },
};
