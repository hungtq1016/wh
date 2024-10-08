import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,value,...props] = params.value;

        let data = null;
        
        switch(type){
            case 'id':
                data = await prisma.collectionExhibition.findUnique({
                    where: {
                        id: value
                    }
                });
                break;
            case 'collectionId':
                data = await prisma.collectionExhibition.findMany({
                        where: {
                            collectionId: value
                        }
                    });
                    break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "Collection Exhibition not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,value,...props] = params.value;

        const { collectionId, title, desccription, image  } = await req.json();
        
        let data = null;

        switch(type){

            case 'id':
                data = await prisma.collectionExhibition.update({
                    where: {
                        id: value
                    },
                    data: {
                        collectionId, title, desccription, image 
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Collection Exhibition not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type,value,...props] = params.value;

        let data = null;

        switch(type){
            case 'id':
                data = await prisma.collectionExhibition.delete({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Collection Exhibition not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}