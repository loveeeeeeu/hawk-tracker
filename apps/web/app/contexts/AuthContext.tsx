import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 本地定义 User 类型
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 用户数据
const mockUsers = [
  { id: 1, username: 'user', password: '123', name: '用户', email: 'user@example.com' }
];

// token 存储
const TOKEN_KEY = 'hawk_tracker_token';
const USER_KEY = 'hawk_tracker_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查用户认证状态
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const login = async (username: string, password: string) => {
    try {
      // 网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 验证用户名和密码
      const foundUser = mockUsers.find(u => u.username === username && u.password === password);

      if (!foundUser) {
        throw new Error('用户名或密码错误');
      }

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };

      // 生成 token
      const token = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 保存到 localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  // 注册
  const register = async (username: string, password: string) => {
    try {
      // 网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 检查用户名是否已存在
      const existingUser = mockUsers.find(u => u.username === username);
      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 注册新用户
      const newUser = {
        id: mockUsers.length + 1,
        name: username,
        email: `${username}@example.com`
      };

      // 生成 token
      const token = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 保存到 localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      // 网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      // 清除本地存储
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}