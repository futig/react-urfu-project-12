export const MESSAGES_QUERY_KEY = ['messages'];

export const addMessageToCache = (queryClient, message) => {
  queryClient.setQueryData(MESSAGES_QUERY_KEY, (messages = []) => {
    const messageExists = messages.some(({ id }) => id === message.id);

    return messageExists ? messages : [...messages, message];
  });
};
