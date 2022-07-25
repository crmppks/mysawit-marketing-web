import { postAuthMasuk } from '@/services/auth';
import { getProfileDetail, postUpdateProfile } from '@/services/profile';
import {
  GET_ALL_NOTIFICATION_REQUEST,
  GET_PROFILE_FAILURE,
  GET_PROFILE_SUCCESS,
  SIGNIN_USER_FAILURE,
  SIGNIN_USER_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_SUCCESS,
} from '@/store/types';
import Cookies from 'js-cookie';
import { call, put } from 'redux-saga/effects';

export function* signInUserHandler(action: any) {
  try {
    const { data } = yield call(postAuthMasuk, action.params);
    Cookies.set(process.env.REACT_APP_ACCESS_TOKEN!, data.access_token, {
      expires: 1,
      sameSite: 'Strict',
    });
    Cookies.set(process.env.REACT_APP_REFRESH_TOKEN!, data.refresh_token, {
      expires: 1,
      sameSite: 'Strict',
    });

    yield put({ type: SIGNIN_USER_SUCCESS, user: data.user });
  } catch (e) {
    yield put({
      type: SIGNIN_USER_FAILURE,
      message: e.response?.data?.message || e.message,
      errors: e.response?.data?.errors,
    });
  }
}

export function* getProfileDetailHandler() {
  try {
    const { data } = yield call(getProfileDetail);

    yield put({ type: GET_PROFILE_SUCCESS, user: data });
    yield put({ type: GET_ALL_NOTIFICATION_REQUEST });
  } catch (e) {
    yield put({
      type: GET_PROFILE_FAILURE,
      message: e.response?.data?.message || e.message,
      errors: e.response?.data?.errors,
    });
  }
}

export function* updateProfileHandler(action: any) {
  try {
    const { data } = yield call(postUpdateProfile, action.params);

    yield put({ type: UPDATE_PROFILE_SUCCESS, user: data });
  } catch (e) {
    yield put({
      type: UPDATE_PROFILE_FAILURE,
      message: e.response?.data?.message || e.message,
      errors: e.response?.data?.errors,
    });
  }
}

export function clearSesiHandler() {
  Cookies.remove(process.env.REACT_APP_ACCESS_TOKEN!);
  Cookies.remove(process.env.REACT_APP_REFRESH_TOKEN!);
}
