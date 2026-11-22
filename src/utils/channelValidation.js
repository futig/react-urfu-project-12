import { hasLength } from '@mantine/form';

import cleanText from './profanity.js';

const validateChannelName = (channels, t, currentChannelId = null) => (value) => {
  const cleanedName = cleanText(value.trim());
  const validateLength = hasLength(
    { min: 3, max: 20 },
    t(($) => $.validation.channelLength),
  );
  const lengthError = validateLength(cleanedName);

  if (lengthError) {
    return lengthError;
  }

  const normalizedName = cleanedName.toLowerCase();
  const nameExists = channels.some(({ id, name }) => (
    String(id) !== String(currentChannelId)
    && cleanText(name).trim().toLowerCase() === normalizedName
  ));

  return nameExists ? t(($) => $.validation.channelExists) : null;
};

export default validateChannelName;
