import { useAppSelector } from '@/hooks/redux_hooks';
import { Navigate } from 'react-router-dom';

export default function RouteGuestComponent({ children }: any) {
  const session = useAppSelector((state) => state.sesi.user);

  if (session) {
    return <Navigate to={'/'} replace />;
  }

  return children;
}
