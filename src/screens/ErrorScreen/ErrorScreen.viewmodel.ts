import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

type ErrorScreenViewModelParams = {
  routeError?: string | null;
  fallbackError?: unknown;
};

const resolveErrorMessage = (
  routeError: string | null | undefined,
  fallbackError: unknown,
): string | undefined => {
  if (routeError) {
    return routeError;
  }

  if (fallbackError instanceof Error) {
    return fallbackError.message;
  }

  if (typeof fallbackError === 'string') {
    return fallbackError;
  }

  return undefined;
};

const useErrorScreenViewModel = ({
  routeError,
  fallbackError,
}: ErrorScreenViewModelParams) => {
  const {t} = useTranslation();

  const errorMessage = useMemo(() => {
    const resolved = resolveErrorMessage(routeError, fallbackError);
    return resolved ?? t('common.error');
  }, [fallbackError, routeError, t]);

  return {
    errorMessage,
  };
};

export default useErrorScreenViewModel;

