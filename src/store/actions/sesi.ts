import { CLEAR_SESI, GET_SESI_REQUEST, UPDATE_SESI_REQUEST } from '../types';

export const getSesiAction = (params: { id: string; password: string }) => ({
  type: GET_SESI_REQUEST,
  params,
});

export const updateSesiAction = (params: any) => ({
  type: UPDATE_SESI_REQUEST,
  params,
});

export const clearSesiAction = () => ({
  type: CLEAR_SESI,
});
