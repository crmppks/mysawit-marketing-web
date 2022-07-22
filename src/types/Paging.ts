interface Paging<model> {
  loading?: boolean;
  current_page?: number;
  data: Array<model>;
  first_page_url?: string;
  from?: number;
  last_page?: 4;
  last_page_url?: string;
  next_page_url?: string;
  path?: string;
  per_page?: number;
  prev_page_url?: string;
  to?: number;
  total?: number;
}

export default Paging;
