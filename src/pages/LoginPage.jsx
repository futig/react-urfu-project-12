import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

const LoginPage = () => {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  return (
    <Center mih="100vh" p="md">
      <Paper
        component="form"
        onSubmit={form.onSubmit(() => {})}
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
          <TextInput
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            name="username"
            autoComplete="username"
            required
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            name="password"
            autoComplete="current-password"
            required
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth>
            Войти
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default LoginPage;
