import { message } from 'antd';

export const censorWord = function (str: string) {
  return str[0] + str[1] + '*'.repeat(str.length - 4) + str.slice(-2);
};

export const censorEmail = function (email: string) {
  var arr = email.split('@');
  return censorWord(arr[0]) + '@' + censorWord(arr[1]);
};

export const handleCopy = (text: string | number, object: string = 'Teks') => {
  navigator.clipboard.writeText(text.toString());
  message.success(`${object} berhasil disalin`);
};
