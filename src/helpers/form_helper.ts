import { FormInstance, message, UploadFile } from 'antd';

export const parseError = (
  form: FormInstance<any>,
  errors: any,
  from_axios_response: boolean = true,
) => {
  const errs = from_axios_response ? errors.response?.data?.errors || {} : errors;
  const keys = Object.keys(errs);

  const fields = keys.map((key) => ({
    name: key,
    errors: errs[key],
  }));

  form.setFields(fields);
};

export const beforeUploadImage = (file: UploadFile, max_size: number = 3) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Ekstensi file yang diijinkan adalah png, jpg, jpeg');
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 <= max_size;
  if (!isLt2M) {
    message.error('File harus berukuran lebih kecil dari 3 MB');
    return false;
  }

  return true;
};

export const beforeUpload = (
  file: any,
  allowed_types: Array<string>,
  max_size: number = 3,
) => {
  const isJpgOrPng = allowed_types.includes(file?.type);
  if (!isJpgOrPng) {
    message.error(`Ekstensi file yang diijinkan adalah ${allowed_types.join(', ')}`);
    return false;
  }

  const isLt2M = file?.size / 1024 / 1024 <= max_size;
  if (!isLt2M) {
    message.error(`Ukuran file harus lebih kecil dari ${max_size} MB`);
    return false;
  }

  return false;
};

export const getBase64 = (img: any, callback: (val: any) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
