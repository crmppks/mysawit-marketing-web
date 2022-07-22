import UserMarketing from '@/types/UserMarketing';
import {
  CLEAR_SESI,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  SIGNIN_USER_FAILURE,
  SIGNIN_USER_REQUEST,
  SIGNIN_USER_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from '../types';

export interface SesiActionType {
  type: string;
  user: UserMarketing | null;
  message?: string;
  errors?: any;
}

export interface SesiValueType {
  user: UserMarketing | null;
  request_login: {
    loading: boolean;
    message?: string;
    errors?: any;
  };
  request_profile: {
    loading: boolean;
    message?: string;
    errors?: any;
  };
  user_prev?: any;
}

const initialState: SesiValueType = {
  request_login: {
    loading: false,
    message: undefined,
    errors: null,
  },
  request_profile: {
    loading: false,
    message: undefined,
    errors: null,
  },
  user: null,
  user_prev: null,
};

export default function sessionReducer(
  state = initialState,
  action: SesiActionType,
): SesiValueType {
  const { type, errors, message, user } = action;

  if (type === SIGNIN_USER_REQUEST) {
    return {
      ...state,
      request_login: {
        ...state.request_login,
        loading: true,
      },
    };
  }

  if (type === SIGNIN_USER_SUCCESS) {
    return {
      ...state,
      request_login: {
        ...state.request_login,
        loading: false,
        message: null,
        errors: null,
      },
      user,
    };
  }

  if (type === SIGNIN_USER_FAILURE) {
    return {
      ...state,
      request_login: {
        loading: false,
        message,
        errors,
      },
    };
  }

  if (type === UPDATE_PROFILE_REQUEST) {
    return {
      ...state,
      request_profile: {
        ...state.request_profile,
        loading: true,
      },
    };
  }

  if (type === UPDATE_PROFILE_SUCCESS) {
    return {
      ...state,
      request_profile: {
        ...state.request_profile,
        loading: false,
        message: null,
        errors: null,
      },
      user,
    };
  }

  if (type === UPDATE_PROFILE_FAILURE) {
    return {
      ...state,
      request_profile: {
        ...state.request_profile,
        loading: false,
        message,
        errors,
      },
    };
  }

  if (type === GET_PROFILE_REQUEST) {
    return {
      ...state,
      request_profile: {
        ...state.request_profile,
        loading: true,
      },
    };
  }

  if (type === GET_PROFILE_SUCCESS) {
    return {
      ...state,
      request_profile: {
        ...state.request_profile,
        loading: false,
        errors: null,
        message: null,
      },
      user,
    };
  }

  if (type === GET_PROFILE_SUCCESS) {
    return {
      ...state,
      request_profile: {
        ...state.request_profile,
        loading: false,
        errors,
        message,
      },
    };
  }

  if (type === CLEAR_SESI) {
    return initialState;
  }

  return state;
}
