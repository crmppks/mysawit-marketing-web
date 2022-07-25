import { combineReducers } from 'redux';
import sesi from '@/store/reducers/sesi';
import notifikasi from '@/store/reducers/notifikasi';

export default combineReducers({
  sesi,
  notifikasi,
});
