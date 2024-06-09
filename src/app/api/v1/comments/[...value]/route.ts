import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;
        let data = null;
        switch (type) {
            case 'id':
                data = await prisma.review.findUnique({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "Review not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
   
        const [type, value, ...props] = params.value;
        const { name, productId, rating, content, upVote, downVote } = await req.json();
        let data = null;
        switch (type) {
            case 'id':
                data = await prisma.review.update({
                    where: {
                        id: value
                    },
                    data: { 
                        name, 
                        productId, 
                        rating : Number(rating), 
                        content, 
                        upVote : Number(upVote), 
                        downVote : Number(downVote),
                     }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Review not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        console.log(error)
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;
        let data = null;
        switch (type) {
            case 'id':
                data = await prisma.review.delete({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Review not found");
        }

        return SuccessResponse(data);

    } catch (error) {

        return InternalServerErrorResponse(error);
    }
}