import Notifikasi from '@/types/Notifikasi';
import Paging from '@/types/Paging';
import {
  GET_ALL_NOTIFICATION_FAILURE,
  GET_ALL_NOTIFICATION_REQUEST,
  GET_ALL_NOTIFICATION_SUCCESS,
  GET_BADGE_NOTIFICATION_FAILURE,
  GET_BADGE_NOTIFICATION_SUCCESS,
  GET_MORE_NOTIFICATION_FAILURE,
  GET_MORE_NOTIFICATION_REQUEST,
  GET_MORE_NOTIFICATION_SUCCESS,
  READS_NOTIFICATION_ACTION,
  READS_NOTIFICATION_FAILED,
  READS_NOTIFICATION_SUCCESS,
} from '../types';

export interface NotifikasiActionType {
  type: string;
  list: Paging<Notifikasi>;
  message?: string;
  notification_id?: string;
  badge?: number;
}

export interface NotifikasiValueType {
  loading: boolean;
  list: Paging<Notifikasi>;
  message?: string;
  reads: string[];
  badge: number;
}

const initialState: NotifikasiValueType = {
  loading: false,
  list: {
    data: [],
    total: 0,
  },
  message: null,
  reads: [],
  badge: 0,
};

export default function notifikasiReducer(
  state: NotifikasiValueType = initialState,
  action: NotifikasiActionType,
): NotifikasiValueType {
  const { type, list, message, notification_id, badge } = action;

  switch (type) {
    case GET_ALL_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        message: null,
        list,
      };
    case GET_ALL_NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        message,
      };
    case GET_MORE_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_MORE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        list: {
          ...list,
          data: [...state.list.data, ...list.data],
        },
        message: null,
      };
    case GET_MORE_NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        message,
      };
    case READS_NOTIFICATION_ACTION:
      return {
        ...state,
        list: {
          ...state.list,
          data: state.list.data.map((item) => {
            if (item.id === notification_id) {
              return {
                ...item,
                read_at: item.updated_at,
              };
            }
            return item;
          }),
        },
        reads: state.reads.includes(notification_id)
          ? state.reads
          : [...state.reads, notification_id],
      };
    case READS_NOTIFICATION_SUCCESS:
      return {
        ...state,
        reads: [],
        badge,
        message: null,
      };
    case READS_NOTIFICATION_FAILED: {
      return {
        ...state,
        message,
      };
    }
    case GET_BADGE_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        badge,
        message: null,
      };
    }
    case GET_BADGE_NOTIFICATION_FAILURE: {
      return {
        ...state,
        message,
      };
    }
    default:
      return state;
  }
}
