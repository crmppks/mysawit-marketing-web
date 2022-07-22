import { FormInstance, message } from 'antd';

export const parseError = (form: FormInstance<any>, errors: any) => {
  const errs = errors.response?.data?.errors || {};
  const keys = Object.keys(errs);

  const fields = keys.map((key) => ({
    name: key,
    errors: errs[key],
  }));

  form.setFields(fields);
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
