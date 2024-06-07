export function urlBuilder(path: string, params?: {[key:string]:string|string[]}): string {
    let queryString: string =
    process.env.API_DOMAIN || "https://world-history-cms.vercel.app/" + path
  
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
  