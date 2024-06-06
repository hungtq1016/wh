import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { NextRequest } from "next/server";

const { SuccessResponse, InternalServerErrorResponse, NotFoundResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: NextRequest) {
    try {
        const [type,value,...data] = req.nextUrl.searchParams.getAll("includes");
        console.log(type,value,data)
        let images = [] as any;

        switch (type) {
            case 'user':
                images = await prisma.image.findMany({
                    where: { userId : { not : null } }
                });
                break;

            case 'product':
                images = await prisma.image.findMany({
                    where: { productId : { not : null} },
                });
                break;

            case 'allnull':
                images = await prisma.image.findMany({
                    where: {
                        AND : [
                            { productId : null },
                            { userId : null }
                        ]
                    }
                });
                break;
        
            default:
                images = await prisma.image.findMany();
                break;
        }

        if (!images) {
            return NotFoundResponse(null, "Images not found");
        }

        return SuccessResponse(images);
    } catch (error) {
 
        return InternalServerErrorResponse(error);
    }
}

export async function POST(req: Request) {
    try {
        const images  = await req.json();

        const response = await prisma.image.createMany({
            data: images,
            skipDuplicates: true
        });

        return CreatedResponse(images);

    } catch (error) {
        console.log(error)
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { images } = await req.json();

        const response = await prisma.image.updateMany({
            data: images
        });

        return SuccessResponse(response);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { images } = await req.json();

        const response = await prisma.image.deleteMany(images)

        return SuccessResponse(response);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}