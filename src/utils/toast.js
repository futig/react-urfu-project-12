import { notifications } from '@mantine/notifications';

export const showErrorToast = (title, message, id) => {
  return notifications.show({
    id,
    color: 'red',
    title,
    message,
  });
};

export const showSuccessToast = (title, message) => {
  return notifications.show({
    color: 'green',
    title,
    message,
  });
};
