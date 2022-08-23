// Hook (use-projects.tsx)
import { useQuery } from 'react-query';
import { getProjects } from '@lib/api';

export function useProjects() {
  const { isFetching, isIdle, isLoading, data } = useQuery(
    ['projects'],
    getProjects,
  );

  return { isFetching, isIdle, isLoading, data };
}
