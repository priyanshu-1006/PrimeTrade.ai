import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export interface Signal {
  id: string;
  symbol: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  createdAt: string;
}

export const useSignals = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['signals', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/signals?page=${page}&limit=${limit}`);
      return data.data; // { signals, pagination }
    },
  });
};

export const useCreateSignal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSignal: Omit<Signal, 'id' | 'status' | 'createdAt'>) => {
      const { data } = await api.post('/signals', newSignal);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
      toast.success('Signal created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create signal');
    },
  });
};

export const useDeleteSignal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/signals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
      toast.success('Signal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete signal');
    },
  });
};
