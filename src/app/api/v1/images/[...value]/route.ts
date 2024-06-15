import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";
import { del } from '@vercel/blob';

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;
        let data = null;
        switch(type){
            case 'id':
                data = await prisma.image.findUnique({
                    where: {
                        id: value
                    }
                });
                break;
            case 'productId':
                data = await prisma.image.findFirst({
                    where: {
                        productId: data
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "Image not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, value, ...props] = params.value;
        const { alt } = await req.json();
        let data = null;
        switch (type) {
            case 'id':
                data = await prisma.image.update({
                    where: {
                        id: value
                    },
                    data: {
                        alt
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Image not found");
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
                data = await prisma.image.delete({
                    where: {
                        id: value
                    }
                });
                if(data.url.includes("https://ooy4b0bespx7vwie.public.blob.vercel-storage.com/")){
                    await del(data.url);
                }
                    

                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Image not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}