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
                data = await prisma.policy.findUnique({
                    where: {
                        id: value
                    }
                });
                break;
            case 'suffix':
                data = await prisma.policy.findMany({
                    where: {
                        suffix: value
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "Policy not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
   
        const [type, value, ...props] = params.value;
        const { title, content, suffix } = await req.json();
        let data = null;
        switch (type) {
            case 'id':
                data = await prisma.policy.update({
                    where: {
                        id: value
                    },
                    data: {title, content, suffix}
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Policy not found");
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
                data = await prisma.policy.delete({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Policy not found");
        }

        return SuccessResponse(data);

    } catch (error) {

        return InternalServerErrorResponse(error);
    }
}