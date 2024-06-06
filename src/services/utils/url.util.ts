export function urlBuilder(path: string, params?: string[]): string {
    let queryString: string =
        process.env.API_DOMAIN || "http://localhost:3000" + path

    if (params) {
        const query = params // Lọc bỏ các giá trị rỗng
            .map((value) => `includes=${encodeURIComponent(value)}`)
            .join('&');
        if (query) { // Chỉ thêm query nếu có nội dung
            queryString += `?${query}`;
        }
    }

    return queryString
}