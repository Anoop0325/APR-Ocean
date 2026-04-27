export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized (optional: logout user)
  }

  return response;
}

export const authApi = {
  getProfile: () => apiFetch('/auth/profile/'),
  updateProfile: (data: any) => apiFetch('/auth/profile/', {
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data),
  }),
};

export const addressApi = {
  getAddresses: () => apiFetch('/auth/addresses/'),
  addAddress: (data: any) => apiFetch('/auth/addresses/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteAddress: (id: number) => apiFetch(`/auth/addresses/${id}/`, {
    method: 'DELETE',
  }),
  updateAddress: (id: number, data: any) => apiFetch(`/auth/addresses/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};
