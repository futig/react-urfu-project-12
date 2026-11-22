import { useState } from 'react';
import {
  Alert,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore.js';

const LoginPage = () => {
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.status === 401) {
        setAuthError('Неверные имя пользователя или пароль');
        return;
      }

      if (!response.ok) {
        setAuthError('Ошибка сервера. Попробуйте ещё раз');
        return;
      }

      const userData = await response.json();
      login(userData);
      navigate('/', { replace: true });
    } catch {
      setAuthError('Ошибка сети. Попробуйте ещё раз');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Center mih="100vh" p="md">
      <Paper
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
        withBorder
        shadow="sm"
        radius="md"
        p="xl"
        w="100%"
        maw={400}
      >
        <Stack>
          <Title order={1} ta="center">
            Войти
          </Title>
          {authError && (
            <Alert color="red" variant="light" role="alert">
              {authError}
            </Alert>
          )}
          <TextInput
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            name="username"
            autoComplete="username"
            required
            disabled={isSubmitting}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            name="password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            Войти
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default LoginPage;
