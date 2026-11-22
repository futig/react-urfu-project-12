const request = async (path, token) => {
  const response = await fetch(`/api/v1${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getChannels = (token) => request('/channels', token);

export const getMessages = (token) => request('/messages', token);
