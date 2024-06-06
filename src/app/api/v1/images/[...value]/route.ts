import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";
import * as bcrypt from 'bcrypt';

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,data,...value] = params.value;
        let image = null;
        switch(type){
            case 'id':
                image = await prisma.image.findUnique({
                    where: {
                        id: data
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!image) {
            return NotFoundResponse(null, "Image not found");
        }

        return SuccessResponse(image);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, data, ...value] = params.value;
        const { alt } = await req.json();
        let image = null;
        switch (type) {
            case 'id':
                image = await prisma.image.update({
                    where: {
                        id: data
                    },
                    data: {
                        alt
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!image) {
            return NotFoundResponse(null, "Image not found");
        }

        return SuccessResponse(image);

    } catch (error) {
        console.log(error)
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,data,...value] = params.value;
        let image = null;
        switch(type){
            case 'id':
                image = await prisma.image.delete({
                    where: {
                        id: data
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!image) {
            return NotFoundResponse(null, "Image not found");
        }

        return SuccessResponse(image);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}