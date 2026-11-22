import { Alert, Center } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';

const AppErrorBoundary = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Sentry.ErrorBoundary
      fallback={(
        <Center mih="100vh" p="md">
          <Alert color="red" title={t(($) => $.errors.unexpectedTitle)} maw={500}>
            {t(($) => $.errors.unexpected)}
          </Alert>
        </Center>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default AppErrorBoundary;
