import {
  CLEAR_SESI,
  GET_PROFILE_REQUEST,
  OVERRIDE_USER_ACTION,
  SIGNIN_USER_REQUEST,
  UPDATE_PROFILE_REQUEST,
} from '../types';

export const signInUserAction = (params: { id: string; password: string }) => ({
  type: SIGNIN_USER_REQUEST,
  params,
});

export const getProfileDetailAction = () => ({
  type: GET_PROFILE_REQUEST,
});

export const updateProfileAction = (params: any) => ({
  type: UPDATE_PROFILE_REQUEST,
  params,
});

export const clearSesiAction = () => ({
  type: CLEAR_SESI,
});

export const overrideUserAction = (user: any) => ({
  type: OVERRIDE_USER_ACTION,
  user,
});
