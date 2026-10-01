const API_URL =
  import.meta.env.VITE_API_URL || 'https://cmchatapp-1-1gke.onrender.com';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${options.method || 'GET'} ${path} (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  addUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) =>
    request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getChats: () => request('/chats'),
  getChat: (id) => request(`/chats/${id}`),
  createChat: (data) => request('/chats', { method: 'POST', body: JSON.stringify(data) }),
  updateChat: (id, data) =>
    request(`/chats/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteChat: (id) => request(`/chats/${id}`, { method: 'DELETE' }),

  getMessages: (chatId) => request(`/messages?chatId=${chatId}`),
  sendMessage: (data) => request('/messages', { method: 'POST', body: JSON.stringify(data) }),
  updateMessage: (id, data) =>
    request(`/messages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getCalls: () => request('/calls'),
  addCall: (data) => request('/calls', { method: 'POST', body: JSON.stringify(data) }),

  getStatuses: () => request('/statuses'),
  addStatus: (data) => request('/statuses', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, data) =>
    request(`/statuses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export default api;
