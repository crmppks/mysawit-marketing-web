import { postAuthMasuk } from '@/services/auth';
import { postUpdateProfile } from '@/services/profile';
import {
  GET_SESI_FAILURE,
  GET_SESI_SUCCESS,
  UPDATE_SESI_FAILURE,
  UPDATE_SESI_SUCCESS,
} from '@/store/types';
import Cookies from 'js-cookie';
import { call, put } from 'redux-saga/effects';

export function* getSesiRequestHandler(action: any) {
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

    yield put({ type: GET_SESI_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: GET_SESI_FAILURE });
  }
}

export function* updateSesiRequestHandler(action: any) {
  try {
    const { data } = yield call(postUpdateProfile, action.params);

    yield put({ type: UPDATE_SESI_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: UPDATE_SESI_FAILURE });
  }
}

export function clearSesiHandler() {
  Cookies.remove(process.env.REACT_APP_ACCESS_TOKEN!);
  Cookies.remove(process.env.REACT_APP_REFRESH_TOKEN!);
}
