import axios from "axios";
import { IPageResponse } from "../types/response.types";
import { TComments } from "../types/comment.type";

export const useComments = (pageNumner: string|number, pageSize: string|number) => axios.get<IPageResponse<TComments>>('/api/v1/comments',{
    params: {
        pageNumber: pageNumner,
        pageSize: pageSize
    }
})