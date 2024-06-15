import { useSearchParams } from 'next/navigation'

export function urlBuilder(path: string, params?: { [key: string]: string | string[] }): string {
  let queryString: string = path

  if (params) {
    const query = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '') // Lọc bỏ các giá trị rỗng
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${v}`).join('&');
        }
        return `${key}=${value}`;
      })
      .join('&');
    if (query) { // Chỉ thêm query nếu có nội dung
      queryString += `?${query}`;
    }
  }

  return queryString
}


export function queryString() {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const searchParams = useSearchParams()
  const searchParamsObject = Object.fromEntries(searchParams)
  return searchParamsObject
}