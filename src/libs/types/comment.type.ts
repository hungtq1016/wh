export interface IComment {
    id: string
    author: string
    productId: string
    color: string
    rating: number
    content: string
    upVote: number
    downVote: number
    createdAt: string
    updatedAt: string
}

export type TComments =  IComment[]
