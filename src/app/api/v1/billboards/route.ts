import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { NextRequest } from "next/server";

const { SuccessResponse, InternalServerErrorResponse, NotFoundResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: NextRequest) {

    const position = req.nextUrl.searchParams.get('position');

    try {
        let data = null;

        if (position) {
            data = await prisma.billBoard.findMany({ 
                where: { position },
                include: { images: true }
             });
        }else{
            data = await prisma.billBoard.findMany({
                include: { images: true }
            });
        }

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
        const { id, title, content, link, position, images } = await req.json();
        
        const data = await prisma.billBoard.create({
            data: {
                id, title, content, link, position
            }
        });

        if (images && images.length > 0) {
            const updatePromises = images.map((image: any) => {
                return prisma.image.update({
                    where: { id: image.id },
                    data: { ...image, billBoardId: data.id }
                });
            });

            await Promise.all(updatePromises);
        }

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