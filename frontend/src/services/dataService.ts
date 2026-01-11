import api from './api';
import { Client, Proposal, ProposalStats, User } from '@/types';

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  getByCPF: async (cpf: string): Promise<Client> => {
    const response = await api.get(`/clients/cpf/${cpf}`);
    return response.data;
  },

  create: async (data: Partial<Client>): Promise<Client> => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Client>): Promise<Client> => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

export const proposalService = {
  getAll: async (): Promise<Proposal[]> => {
    const response = await api.get('/proposals');
    return response.data;
  },

  getById: async (id: number): Promise<Proposal> => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  getByClient: async (clientId: number): Promise<Proposal[]> => {
    const response = await api.get(`/proposals/client/${clientId}`);
    return response.data;
  },

  create: async (data: Partial<Proposal>): Promise<Proposal> => {
    const response = await api.post('/proposals', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Proposal>): Promise<Proposal> => {
    const response = await api.put(`/proposals/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/proposals/${id}`);
  },

  getStats: async (): Promise<ProposalStats> => {
    const response = await api.get('/proposals/stats/overview');
    return response.data;
  },
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Serviço de busca de CEP
export const cepService = {
  fetchAddress: async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido');
    }
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }
    const data = await response.json();
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    return {
      address: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  },
};
