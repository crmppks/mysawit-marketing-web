import UserMarketing from '@/types/UserMarketing';
import {
  CLEAR_SESI,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  OVERRIDE_USER_ACTION,
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

  switch (type) {
    case OVERRIDE_USER_ACTION:
      return {
        ...state,
        user: { ...state.user, ...user },
      };
    case SIGNIN_USER_REQUEST:
      return {
        ...state,
        request_login: {
          ...state.request_login,
          loading: true,
        },
      };
    case SIGNIN_USER_SUCCESS:
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
    case SIGNIN_USER_FAILURE:
      return {
        ...state,
        request_login: {
          loading: false,
          message,
          errors,
        },
      };
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        request_profile: {
          ...state.request_profile,
          loading: true,
          errors: null,
          message: null,
        },
      };
    case UPDATE_PROFILE_SUCCESS:
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
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        request_profile: {
          ...state.request_profile,
          loading: false,
          message,
          errors,
        },
      };
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        request_profile: {
          ...state.request_profile,
          loading: true,
          errors: null,
          message: null,
        },
      };
    case GET_PROFILE_SUCCESS:
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
    case CLEAR_SESI:
      return initialState;
    default:
      return state;
  }
}
