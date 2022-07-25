import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/index';
import { SesiValueType } from '@/store/reducers/sesi';
import { NotifikasiValueType } from '@/store/reducers/notifikasi';

interface RootState {
  sesi: SesiValueType;
  notifikasi: NotifikasiValueType;
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
