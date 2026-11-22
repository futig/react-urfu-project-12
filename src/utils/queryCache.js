export const CHANNELS_QUERY_KEY = ['channels'];
export const MESSAGES_QUERY_KEY = ['messages'];

const isSameId = (firstId, secondId) => String(firstId) === String(secondId);

export const addMessageToCache = (queryClient, message) => {
  queryClient.setQueryData(MESSAGES_QUERY_KEY, (messages = []) => {
    const messageExists = messages.some(({ id }) => isSameId(id, message.id));

    return messageExists ? messages : [...messages, message];
  });
};

export const upsertChannelInCache = (queryClient, channel) => {
  queryClient.setQueryData(CHANNELS_QUERY_KEY, (channels = []) => {
    const channelExists = channels.some(({ id }) => isSameId(id, channel.id));

    return channelExists
      ? channels.map((item) => (isSameId(item.id, channel.id) ? channel : item))
      : [...channels, channel];
  });
};

export const removeChannelFromCache = (queryClient, channelId) => {
  queryClient.setQueryData(CHANNELS_QUERY_KEY, (channels = []) => (
    channels.filter(({ id }) => !isSameId(id, channelId))
  ));
  queryClient.setQueryData(MESSAGES_QUERY_KEY, (messages) => (
    messages?.filter((message) => !isSameId(message.channelId, channelId))
  ));
};
