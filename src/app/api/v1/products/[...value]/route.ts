import { NextRequest } from "next/server";
import { prisma } from "@/libs/db";
import ResponseHelper from "@/services/helpers/response.helper";

const { SuccessResponse, InternalServerErrorResponse, BadRequestResponse, NotFoundResponse } = ResponseHelper();

export async function GET(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, data, ...value] = params.value;
        let product = null;
        switch (type) {
            case 'id':
                product = await prisma.product.findUnique({
                    where: {
                        id: data
                    },
                    include:{
                        images:true
                    }
                });
                break;
            case 'slug':
                product = await prisma.product.findUnique({
                    where: {
                        slug: data
                    },
                    include:{
                        images:true
                    }
                });
                break;
            case 'sku':
                product = await prisma.product.findUnique({
                    where: {
                        sku: data
                    },
                    include:{
                        images:true
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid type");
        }

        if (!product) {
            return NotFoundResponse(null, "Product not found");
        }

        return SuccessResponse(product);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
   
        const [type, data, ...value] = params.value;
        const { name, slug, description, shortDescription, sku, salePrice, price, isSale, quantity, attributes, images } = await req.json();
        let product = null;
        switch (type) {
            case 'id':
                product = await prisma.product.update({
                    where: {
                        id: data
                    },
                    data: {
                        name,
                        slug,
                        description,
                        shortDescription,
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

        if (!product) {
            return NotFoundResponse(null, "Product not found");
        }

        if (images && images.length > 0) {
            const updatePromises = images.map((image: any) => {
                return prisma.image.update({
                    where: { id: image.id },
                    data: { ...image, productId: product.id }
                });
            });

            await Promise.all(updatePromises);
        }

        return SuccessResponse(product);

    } catch (error) {
        console.log(error)
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { value: string[] } }) {
    try {
        const [type, data, ...value] = params.value;
        let product = null;
        switch (type) {
            case 'id':
                product = await prisma.product.delete({
                    where: {
                        id: data
                    }
                });
                break;
            default:
                return BadRequestResponse(null, "Invalid ID");
        }

        if (!product) {
            return NotFoundResponse(null, "Product not found");
        }

        return SuccessResponse(product);

    } catch (error) {

        return InternalServerErrorResponse(error);
    }
}