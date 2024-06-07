import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import * as bcrypt from 'bcrypt';

const { SuccessResponse, InternalServerErrorResponse, FiledsErrorResponse, NotFoundResponse, ConflictResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: Request) {
    try {
        const data = await prisma.billBoard.findMany();

        if (!data) {
            return NotFoundResponse(null, "Billboards not found");
        }

        return SuccessResponse(data);
    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function POST(req: Request) {
    try {
        const { title, content, link, imageUrl, position, image } = await req.json();
        
        const data = await prisma.billBoard.create({
            data: {
                title, content, link, imageUrl, position, image
            }
        });

        return CreatedResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { billboards } = await req.json();

        const data = await prisma.billBoard.updateMany({
            data: billboards
        });

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { billboards } = await req.json();

        const data = await prisma.billBoard.deleteMany(billboards)

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}