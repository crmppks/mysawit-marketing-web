import {
  CLEAR_SESI,
  GET_PROFILE_REQUEST,
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

export default function* rootSaga() {
  yield takeLatest(SIGNIN_USER_REQUEST, signInUserHandler);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileHandler);
  yield takeLatest(GET_PROFILE_REQUEST, getProfileDetailHandler);
  yield takeEvery(CLEAR_SESI, clearSesiHandler);
}
