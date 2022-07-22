import swal from '@sweetalert/with-react';
import { ReactNode } from 'react';

export const confirmAlert = (title: string, message: string | ReactNode = '') => {
  return swal({
    title,
    content: <p className="text-gray-500">{message}</p>,
    buttons: {
      cancel: 'Tidak',
      confirm: {
        text: 'Ya',
        value: true,
        visible: true,
        className: 'bg-color-theme hover:bg-color-theme',
        closeModal: true,
      },
    },
    dangerMode: true,
  });
};
