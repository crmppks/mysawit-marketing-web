export const formatCurrency = (x: string | number) => {
  if (!x) return '-';
  return `Rp ${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export const formatWeight = (x: number) => {
  if (x > 1000000) {
    return Math.round(x / 1000000) + ' TON';
  }

  if (x > 1000) {
    return Math.round(x / 1000) + ' Kg';
  }

  return `${x} gr`;
};

export const needToChooseMarketing = (response: any) => {
  if (response.status === 202) return true;
  return false;
};
