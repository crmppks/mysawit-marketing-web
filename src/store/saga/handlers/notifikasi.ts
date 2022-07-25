import {
  getJumlahBadgeNotifikasi,
  getSemuaNotifikasi,
  postReadsNotifikasi,
} from '@/services/notifikasi';
import {
  GET_ALL_NOTIFICATION_FAILURE,
  GET_ALL_NOTIFICATION_SUCCESS,
  GET_BADGE_NOTIFICATION_FAILURE,
  GET_BADGE_NOTIFICATION_REQUEST,
  GET_BADGE_NOTIFICATION_SUCCESS,
  GET_MORE_NOTIFICATION_FAILURE,
  GET_MORE_NOTIFICATION_SUCCESS,
  READS_NOTIFICATION_FAILED,
  READS_NOTIFICATION_SUCCESS,
} from '@/store/types';
import { call, put } from 'redux-saga/effects';

export function* getAllNotificationHandler() {
  try {
    const { data } = yield call(getSemuaNotifikasi);

    yield put({ type: GET_ALL_NOTIFICATION_SUCCESS, list: data });
    yield put({ type: GET_BADGE_NOTIFICATION_REQUEST });
  } catch (e) {
    yield put({
      type: GET_ALL_NOTIFICATION_FAILURE,
      message: e.response?.data?.message || e.message,
    });
  }
}

export function* getMoreNotificationHandler(action: any) {
  try {
    const { data } = yield call(getSemuaNotifikasi, action.next_page_url);

    yield put({ type: GET_MORE_NOTIFICATION_SUCCESS, list: data });
  } catch (e) {
    yield put({
      type: GET_MORE_NOTIFICATION_FAILURE,
      message: e.response?.data?.message || e.message,
    });
  }
}

export function* getBadgeNotificationHandler() {
  try {
    const { data } = yield call(getJumlahBadgeNotifikasi);

    yield put({ type: GET_BADGE_NOTIFICATION_SUCCESS, badge: data });
  } catch (e) {
    yield put({
      type: GET_BADGE_NOTIFICATION_FAILURE,
      message: e.response?.data?.message || e.message,
    });
  }
}

export function* readsAllNotificationHandler(action: any) {
  try {
    if (action.notification_ids.length > 0) {
      const { data } = yield call(postReadsNotifikasi, action.notification_ids);
      yield put({ type: READS_NOTIFICATION_SUCCESS, badge: data });
    }
  } catch (e) {
    yield put({
      type: READS_NOTIFICATION_FAILED,
      message: e.response?.data?.message || e.message,
    });
  }
}
