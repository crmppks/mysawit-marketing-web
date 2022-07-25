import {
  GET_ALL_NOTIFICATION_REQUEST,
  GET_BADGE_NOTIFICATION_REQUEST,
  GET_MORE_NOTIFICATION_REQUEST,
  READS_NOTIFICATION_ACTION,
  READS_NOTIFICATION_REQUEST,
} from '../types';

export const getAllNotificationAction = () => ({
  type: GET_ALL_NOTIFICATION_REQUEST,
});

export const getMoreNotificationAction = (next_page_url: string) => ({
  type: GET_MORE_NOTIFICATION_REQUEST,
  next_page_url,
});

export const getBadgeNotificationAction = () => ({
  type: GET_BADGE_NOTIFICATION_REQUEST,
});

export const readsNotificationAction = (notification_id: string) => ({
  type: READS_NOTIFICATION_ACTION,
  notification_id,
});

export const readsAllNotificationAction = (notification_ids: string[]) => ({
  type: READS_NOTIFICATION_REQUEST,
  notification_ids,
});
