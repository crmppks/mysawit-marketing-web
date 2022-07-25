import {
  CLEAR_SESI,
  GET_ALL_NOTIFICATION_REQUEST,
  GET_BADGE_NOTIFICATION_REQUEST,
  GET_MORE_NOTIFICATION_REQUEST,
  GET_PROFILE_REQUEST,
  READS_NOTIFICATION_REQUEST,
  SIGNIN_USER_REQUEST,
  UPDATE_PROFILE_REQUEST,
} from '@/store/types';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
  clearSesiHandler,
  getProfileDetailHandler,
  signInUserHandler,
  updateProfileHandler,
} from '@/store/saga/handlers/sesi';
import {
  getAllNotificationHandler,
  getBadgeNotificationHandler,
  getMoreNotificationHandler,
  readsAllNotificationHandler,
} from './handlers/notifikasi';

export default function* rootSaga() {
  yield takeLatest(SIGNIN_USER_REQUEST, signInUserHandler);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileHandler);
  yield takeLatest(GET_PROFILE_REQUEST, getProfileDetailHandler);
  yield takeLatest(GET_ALL_NOTIFICATION_REQUEST, getAllNotificationHandler);
  yield takeLatest(GET_MORE_NOTIFICATION_REQUEST, getMoreNotificationHandler);
  yield takeLatest(GET_BADGE_NOTIFICATION_REQUEST, getBadgeNotificationHandler);
  yield takeLatest(READS_NOTIFICATION_REQUEST, readsAllNotificationHandler);
  yield takeEvery(CLEAR_SESI, clearSesiHandler);
}
