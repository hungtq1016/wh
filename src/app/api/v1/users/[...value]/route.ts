import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";
import * as bcrypt from 'bcrypt';

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,data,...value] = params.value;
        let user = null;
        switch(type){
            case 'id':
                user = await prisma.user.findUnique({
                    where: {
                        id: data
                    }
                });
                break;
            case 'email':
                user = await prisma.user.findUnique({
                    where: {
                        email: data
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!user) {
            return NotFoundResponse(null, "User not found");
        }

        return SuccessResponse(user);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,data,...value] = params.value;
        const { fullName, phoneNumber } = await req.json();
        let user = null;
        switch(type){
            case 'id':
                user = await prisma.user.update({
                    where: {
                        id: data
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

        if (!user) {
            return NotFoundResponse(null, "User not found");
        }

        return SuccessResponse(user);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,data,...value] = params.value;
        let user = null;
        switch(type){
            case 'id':
                user = await prisma.user.delete({
                    where: {
                        id: data
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!user) {
            return NotFoundResponse(null, "User not found");
        }

        return SuccessResponse(user);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}