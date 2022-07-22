import { CLEAR_SESI, GET_SESI_REQUEST, UPDATE_SESI_REQUEST } from '@/store/types';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
  clearSesiHandler,
  getSesiRequestHandler,
  updateSesiRequestHandler,
} from '@/store/saga/handlers/sesi';

export default function* rootSaga() {
  yield takeLatest(GET_SESI_REQUEST, getSesiRequestHandler);
  yield takeLatest(UPDATE_SESI_REQUEST, updateSesiRequestHandler);
  yield takeEvery(CLEAR_SESI, clearSesiHandler);
}
