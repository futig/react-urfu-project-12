import useChatUiStore from '../store/chatUiStore.js';
import { CHANNELS_QUERY_KEY, removeChannelFromCache } from './queryCache.js';

const handleChannelRemoved = (queryClient, channelId) => {
  removeChannelFromCache(queryClient, channelId);

  const { currentChannelId, setCurrentChannelId } = useChatUiStore.getState();

  if (String(currentChannelId) !== String(channelId)) {
    return;
  }

  const channels = queryClient.getQueryData(CHANNELS_QUERY_KEY) ?? [];
  const defaultChannel = channels.find(({ name }) => name === 'general') ?? channels[0];
  setCurrentChannelId(defaultChannel?.id ?? null);
};

export default handleChannelRemoved;
