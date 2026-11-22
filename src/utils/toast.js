import { notifications } from '@mantine/notifications';

export const showErrorToast = (message, id) => {
  return notifications.show({
    id,
    color: 'red',
    message,
  });
};

export const showSuccessToast = (message) => {
  return notifications.show({
    color: 'green',
    message,
  });
};
