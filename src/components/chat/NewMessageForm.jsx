import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

const NewMessageForm = () => {
  const form = useForm({
    initialValues: {
      body: '',
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(() => {})}>
      <Group wrap="nowrap" align="start">
        <TextInput
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          name="body"
          flex={1}
          {...form.getInputProps('body')}
        />
        <Button type="submit">Отправить</Button>
      </Group>
    </Box>
  );
};

export default NewMessageForm;
