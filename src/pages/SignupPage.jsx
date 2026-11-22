import { useState } from 'react';
import {
  Alert,
  Anchor,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { hasLength, isNotEmpty, matchesField, useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore.js';

const SignupPage = () => {
  const [signupError, setSignupError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      username: hasLength(
        { min: 3, max: 20 },
        'Имя пользователя должно содержать от 3 до 20 символов',
      ),
      password: hasLength({ min: 6 }, 'Пароль должен содержать не менее 6 символов'),
      confirmPassword: (value, values) => (
        isNotEmpty('Подтвердите пароль')(value)
        ?? matchesField('password', 'Пароли должны совпадать')(value, values)
      ),
    },
  });

  const handleSubmit = async ({ username, password }) => {
    setSignupError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.status === 409) {
        setSignupError('Пользователь с таким именем уже существует');
        return;
      }

      if (!response.ok) {
        setSignupError('Ошибка сервера. Попробуйте ещё раз');
        return;
      }

      const userData = await response.json();
      login(userData);
      navigate('/', { replace: true });
    } catch {
      setSignupError('Ошибка сети. Попробуйте ещё раз');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Center h="100%" p="md">
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
            Регистрация
          </Title>
          {signupError && (
            <Alert color="red" variant="light" role="alert">
              {signupError}
            </Alert>
          )}
          <TextInput
            label="Имя пользователя"
            placeholder="От 3 до 20 символов"
            name="username"
            autoComplete="username"
            required
            disabled={isSubmitting}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Не менее 6 символов"
            name="password"
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Подтверждение пароля"
            placeholder="Повторите пароль"
            name="confirmPassword"
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('confirmPassword')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            Зарегистрироваться
          </Button>
          <Text ta="center" size="sm">
            Уже есть аккаунт?{' '}
            <Anchor component={Link} to="/login">
              Войти
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
};

export default SignupPage;
