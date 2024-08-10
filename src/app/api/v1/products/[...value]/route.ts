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
                data = await prisma.product.findUnique({
                    where: {
                        id: value
                    },
                    include:{
                        images:true
                    }
                });
                break;
            case 'slug':
                data = await prisma.product.findUnique({
                    where: {
                        slug: value
                    },
                    include:{
                        images:true
                    }
                });
                break;
            case 'sku':
                data = await prisma.product.findUnique({
                    where: {
                        sku: value
                    },
                    include:{
                        images:true
                    }
                });
                break;
            case 'random':
                    const records = await prisma.product.findMany()
                    data = records[0] 
                    break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!data) {
            return NotFoundResponse(null, "Product not found");
        }

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
   
        const [type, value, ...props] = params.value;
        const { name, slug, description, about, sku, salePrice, price, isSale, quantity, attributes, images } = await req.json();
        
        let data = null;

        switch (type) {
            case 'id':
                data = await prisma.product.update({
                    where: {
                        id: value
                    },
                    data: {
                        name,
                        slug,
                        description,
                        about,
                        sku,
                        salePrice,
                        price,
                        isSale,
                        quantity,
                        attributes
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Product not found");
        }

        if (images && images.length > 0) {
            const updatePromises = images.map((image: any) => {
                return prisma.image.update({
                    where: { id: image.id },
                    data: { ...image, productId: data.id }
                });
            });

            await Promise.all(updatePromises);
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
        switch (type) {
            case 'id':
                data = await prisma.product.delete({
                    where: {
                        id: value
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!data) {
            return NotFoundResponse(null, "Product not found");
        }

        return SuccessResponse(data);

    } catch (error) {

        return InternalServerErrorResponse(error);
    }
}