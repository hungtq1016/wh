import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';

const { SuccessResponse, InternalServerErrorResponse, NotFoundResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: Request) {
    try {
        const images = await prisma.image.findMany();

        if (!images) {
            return NotFoundResponse(null, "Images not found");
        }

        return SuccessResponse(images);
    } catch (error) {
        console.log(error)
        return InternalServerErrorResponse(error);
    }
}

export async function POST(req: Request) {
    try {
        const images  = await req.json();
        console.log(images)
        const newImages = await prisma.image.createMany({
            data: images,
            skipDuplicates: true
        });

        console.log(newImages)

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