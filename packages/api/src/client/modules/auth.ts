import { LoginPayload, RegisterPayload } from '@/types/auth';
import { User } from '@/types/user';
import {
  apiInstance,
  clearAccessToken,
  setAccessToken,
} from '@/client/instance';

export const auth = {
  login: async (payload: LoginPayload): Promise<User> => {
    const { data } = await apiInstance.post('/auth/login', payload);
    setAccessToken(data.accessToken);
    return data.user;
  },
  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await apiInstance.post('/auth/register', payload);
    setAccessToken(data.accessToken);
    return data.user;
  },
  logout: async () => {
    await apiInstance.post('/auth/logout');
    clearAccessToken();
  },
};
