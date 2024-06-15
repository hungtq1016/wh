export interface IResponse<T> {
    data: T;
    message: string;
    status: number;
    isError: boolean;
}

export interface IMetadata {
    total: number;
    pageSize: number;
    pageNumber: number;
    searchBy: string[];
    searchValue: string[];
    orderBy: string;
    orderType: string;
    nextPage: number | null;
    prevPage: number | null;
    firstPage: number;
    lastPage: number;
}

export interface IPageResponse<T> extends IResponse<{ data: T; metadata: IMetadata }> {}
