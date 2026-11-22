import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Center h="100%" p="md">
      <Stack align="center">
        <Title order={1}>{t(($) => $.notFound.title)}</Title>
        <Text>{t(($) => $.notFound.text)}</Text>
        <Button component={Link} to="/" variant="light">
          {t(($) => $.notFound.home)}
        </Button>
      </Stack>
    </Center>
  );
};

export default NotFoundPage;
