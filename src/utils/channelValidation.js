import { hasLength } from '@mantine/form';

const validateChannelName = (channels, t, currentChannelId = null) => (value) => {
  const validateLength = hasLength(
    { min: 3, max: 20 },
    t(($) => $.validation.channelLength),
  );
  const lengthError = validateLength(value);

  if (lengthError) {
    return lengthError;
  }

  const normalizedName = value.trim().toLowerCase();
  const nameExists = channels.some(({ id, name }) => (
    String(id) !== String(currentChannelId)
    && name.trim().toLowerCase() === normalizedName
  ));

  return nameExists ? t(($) => $.validation.channelExists) : null;
};

export default validateChannelName;
