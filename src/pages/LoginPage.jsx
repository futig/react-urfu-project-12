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
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore.js';
import { showErrorToast } from '../utils/toast.js';

const LoginPage = () => {
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();
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
        setAuthError('login.errors.invalid');
        return;
      }

      if (!response.ok) {
        setAuthError('errors.server');
        return;
      }

      const userData = await response.json();
      login(userData);
      navigate('/', { replace: true });
    } catch {
      setAuthError('errors.network');
      showErrorToast(t(($) => $.notifications.errorTitle), t(($) => $.errors.network));
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
            {t(($) => $.login.title)}
          </Title>
          {authError && (
            <Alert color="red" variant="light" role="alert">
              {t(authError)}
            </Alert>
          )}
          <TextInput
            label={t(($) => $.common.username)}
            placeholder={t(($) => $.login.usernamePlaceholder)}
            name="username"
            autoComplete="username"
            required
            disabled={isSubmitting}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label={t(($) => $.common.password)}
            placeholder={t(($) => $.login.passwordPlaceholder)}
            name="password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            {t(($) => $.login.submit)}
          </Button>
          <Text ta="center" size="sm">
            {t(($) => $.login.noAccount)}{' '}
            <Anchor component={Link} to="/signup">
              {t(($) => $.login.signupLink)}
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
};

export default LoginPage;
