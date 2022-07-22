import { useAppSelector } from '@/hooks/redux_hooks';
import { Navigate } from 'react-router-dom';

export default function RouteProtectedComponent({ children }: any) {
  const session = useAppSelector((state) => state.sesi.user);

  if (session) {
    return children;
  }

  return <Navigate to={'/auth/masuk'} replace />;
}
