import {
  GET_SESI_REQUEST,
  GET_SESI_SUCCESS,
  GET_SESI_FAILURE,
  CLEAR_SESI,
  UPDATE_SESI_REQUEST,
  UPDATE_SESI_SUCCESS,
  UPDATE_SESI_FAILURE,
} from '@/store/types';
import UserAdmin from '@/types/UserAdmin';

export interface SesiAction {
  type: string;
  payload?: {
    token: string;
    user: UserAdmin;
  };
  params?: {
    id: string;
    password: string;
  };
}

export interface SesiState {
  user: UserAdmin | null;
  loading: boolean;
}

const initialState: SesiState = {
  user: null,
  loading: false,
};

export default function sessionReducer(state = initialState, action: SesiAction) {
  const { type, payload } = action;

  if (type === GET_SESI_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === GET_SESI_SUCCESS) {
    return {
      ...state,
      loading: false,
      user: payload?.user,
    };
  }

  if (type === GET_SESI_FAILURE) {
    return {
      ...state,
      loading: false,
    };
  }

  if (type === UPDATE_SESI_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === UPDATE_SESI_SUCCESS) {
    return {
      ...state,
      loading: false,
      user: payload?.user,
    };
  }

  if (type === UPDATE_SESI_FAILURE) {
    return {
      ...state,
      loading: false,
    };
  }

  if (type === CLEAR_SESI) {
    return initialState;
  }

  return state;
}
