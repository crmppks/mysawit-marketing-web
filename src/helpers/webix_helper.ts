import moment from 'moment';

export const webixTableParams = (params: any, key: any = null, parent: any = null) => {
  if (!params) return '';

  return Object.keys(params)
    .reduce(function (a: string[], k: any) {
      if (params[k] instanceof Date) {
        if (parent) {
          a.push(
            `${key ? `${parent}[${key}][${k}]` : k}=${moment(params[k]).format(
              'yyyy-M-DD',
            )}`,
          );
          return a;
        }
        a.push(`${key ? `${key}[${k}]` : k}=${moment(params[k]).format('yyyy-M-DD')}`);
        return a;
      }

      if (typeof params[k] === 'object') {
        a.push(webixTableParams(params[k], k, key));
        return a;
      }

      a.push(`${key ? `${key}[${k}]` : k}=${encodeURIComponent(params[k])}`);
      return a;
    }, [])
    .join('&');
};
