import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Limpar o store antes de cada teste
    useAuthStore.setState({ user: null, token: null });
  });

  it('deve iniciar com user e token nulos', () => {
    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it('deve definir user corretamente', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      role: 'user' as const,
      active: true,
      created_at: new Date().toISOString()
    };

    useAuthStore.getState().setUser(mockUser);
    
    const { user } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
  });

  it('deve definir token corretamente', () => {
    const mockToken = 'test-jwt-token-123';

    useAuthStore.getState().setToken(mockToken);
    
    const { token } = useAuthStore.getState();
    expect(token).toBe(mockToken);
  });

  it('deve fazer logout corretamente', () => {
    // Setup: definir user e token
    const mockUser = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      role: 'user' as const,
      active: true,
      created_at: new Date().toISOString()
    };
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setToken('test-token');

    // Fazer logout
    useAuthStore.getState().logout();

    // Verificar se user e token foram limpos
    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it('isAuthenticated deve retornar true quando user e token existem', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      role: 'user' as const,
      active: true,
      created_at: new Date().toISOString()
    };
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setToken('test-token');

    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });

  it('isAuthenticated deve retornar false quando user ou token não existem', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);

    useAuthStore.getState().setUser({
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      role: 'user',
      active: true,
      created_at: new Date().toISOString()
    });
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('isAdmin deve retornar true para usuário admin', () => {
    const adminUser = {
      id: 1,
      username: 'admin',
      fullName: 'Administrator',
      role: 'admin' as const,
      active: true,
      created_at: new Date().toISOString()
    };
    useAuthStore.getState().setUser(adminUser);

    expect(useAuthStore.getState().isAdmin()).toBe(true);
  });

  it('isAdmin deve retornar false para usuário não-admin', () => {
    const regularUser = {
      id: 2,
      username: 'user',
      fullName: 'Regular User',
      role: 'user' as const,
      active: true,
      created_at: new Date().toISOString()
    };
    useAuthStore.getState().setUser(regularUser);

    expect(useAuthStore.getState().isAdmin()).toBe(false);
  });
});
