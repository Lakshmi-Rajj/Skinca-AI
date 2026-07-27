import { fetchApi } from './api-client';
import { CustomerProfile } from '../types/customer.types';

export const CustomerApi = {
  getProfile: (customerId: string) => fetchApi<CustomerProfile>(`/customers/${customerId}`),
  updateProfile: (customerId: string, data: Partial<CustomerProfile>) =>
    fetchApi<CustomerProfile>(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
