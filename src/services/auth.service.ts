import {
  LoginRequest,
  LoginResponse,
} from '@/types/auth';
import Instance from './instance';

const login = async (params: LoginRequest): Promise<LoginResponse> => {
  return await Instance.post(`/admin/auth/login`, params);
};


const AuthService = {
  login,
};

export default AuthService;
