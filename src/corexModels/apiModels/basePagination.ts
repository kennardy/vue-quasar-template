export class BasePagination {
  page_size: number | string
  last_page: number
  page: number
  total: number

  constructor(raw: PaginationRaw) {
    this.page_size = raw.page_size
    this.last_page = raw.last_page
    this.page = raw.page
    this.total = raw.total
  }

  static empty(): BasePagination {
    return new BasePagination({
      page_size: 20,
      page: 1,
      total: 0,
      last_page: 0,
    })
  }
}

export type PaginationRaw = {
  page_size: number
  last_page: number
  page: number
  total: number
  results?: Array<any>
}

export const emptyPagination: PaginationRaw = {
   page_size: 0,
  last_page: 0,
  page: 0,
  total: 0,
}
