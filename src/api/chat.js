const request = async (path, token, { method = 'GET', body } = {}) => {
  const response = await fetch(`/api/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getChannels = (token) => request('/channels', token);

export const getMessages = (token) => request('/messages', token);

export const createMessage = (token, message) => (
  request('/messages', token, { method: 'POST', body: message })
);
