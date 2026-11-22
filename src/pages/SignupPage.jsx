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
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore.js';

const SignupPage = () => {
  const [signupError, setSignupError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();
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
        t(($) => $.signup.validation.usernameLength),
      ),
      password: hasLength(
        { min: 6 },
        t(($) => $.signup.validation.passwordLength),
      ),
      confirmPassword: (value, values) => (
        isNotEmpty(t(($) => $.signup.validation.confirmRequired))(value)
        ?? matchesField(
          'password',
          t(($) => $.signup.validation.passwordsMismatch),
        )(value, values)
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
        setSignupError('signup.errors.duplicate');
        return;
      }

      if (!response.ok) {
        setSignupError('errors.server');
        return;
      }

      const userData = await response.json();
      login(userData);
      navigate('/', { replace: true });
    } catch {
      setSignupError('errors.network');
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
            {t(($) => $.signup.title)}
          </Title>
          {signupError && (
            <Alert color="red" variant="light" role="alert">
              {t(signupError)}
            </Alert>
          )}
          <TextInput
            label={t(($) => $.common.username)}
            placeholder={t(($) => $.signup.usernamePlaceholder)}
            name="username"
            autoComplete="username"
            required
            disabled={isSubmitting}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label={t(($) => $.common.password)}
            placeholder={t(($) => $.signup.passwordPlaceholder)}
            name="password"
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label={t(($) => $.signup.confirmLabel)}
            placeholder={t(($) => $.signup.confirmPlaceholder)}
            name="confirmPassword"
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            {...form.getInputProps('confirmPassword')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            {t(($) => $.signup.submit)}
          </Button>
          <Text ta="center" size="sm">
            {t(($) => $.signup.hasAccount)}{' '}
            <Anchor component={Link} to="/login">
              {t(($) => $.signup.loginLink)}
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
};

export default SignupPage;
