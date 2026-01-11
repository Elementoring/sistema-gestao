import api from './api';

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    role: 'admin' | 'user';
  };
}

export const authService = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  validateToken: async (): Promise<LoginResponse['user']> => {
    const response = await api.post('/auth/validate');
    return response.data.user;
  },
};
