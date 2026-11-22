import { hasLength } from '@mantine/form';

const validateLength = hasLength(
  { min: 3, max: 20 },
  'Название канала должно содержать от 3 до 20 символов',
);

const validateChannelName = (channels, currentChannelId = null) => (value) => {
  const lengthError = validateLength(value);

  if (lengthError) {
    return lengthError;
  }

  const normalizedName = value.trim().toLowerCase();
  const nameExists = channels.some(({ id, name }) => (
    String(id) !== String(currentChannelId)
    && name.trim().toLowerCase() === normalizedName
  ));

  return nameExists ? 'Канал с таким именем уже существует' : null;
};

export default validateChannelName;
