import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";
import * as bcrypt from 'bcrypt';

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;

        let data = null;

        switch(type){
            case 'id':
                data = await prisma.user.findUnique({
                    where: {
                        id: value
                    }
                });
                break;
            case 'email':
                data = await prisma.user.findUnique({
                    where: {
                        email: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "User not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;
        const { fullName, phoneNumber } = await req.json();
        let data = null;
        switch(type){
            case 'id':
                data = await prisma.user.update({
                    where: {
                        id: value
                    },
                    data: {
                        fullName,
                        phoneNumber
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "User not found");
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
        switch(type){
            case 'id':
                data = await prisma.user.delete({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "User not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}