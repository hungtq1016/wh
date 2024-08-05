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
                data = await prisma.collection.findUnique({
                    where: {
                        id: value
                    }
                });
                break;
            case 'chapter':
                data = await prisma.collection.findUnique({
                    where: {
                        chapter: Number(value) 
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "Collection not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
   
        const [type, value, ...props] = params.value;
        const { chapter, color, content, exhibitions, title, dateTime, description } = await req.json();
        
        let data = null;

        switch (type) {
            case 'id':
                data = await prisma.collection.update({
                    where: {
                        id: value
                    },
                    data: {
                        chapter,
                        color,
                        content,
                        exhibitions,
                        title,
                        dateTime,
                        desc: description
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Collection not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;
        let data = null;
        switch (type) {
            case 'id':
                data = await prisma.collection.delete({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Collection not found");
        }

        return SuccessResponse(data);

    } catch (error) {

        return InternalServerErrorResponse(error);
    }
}