import { useLocation } from 'react-router-dom';

export const useQueryParam = (key: string) => {
  const query = new URLSearchParams(useLocation().search);
  return query.get(key);
};
