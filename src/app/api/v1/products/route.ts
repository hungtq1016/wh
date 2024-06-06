import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { pushFieldToFields } from '@/services/utils/string.util';

const { SuccessResponse, InternalServerErrorResponse, FiledsErrorResponse, NotFoundResponse, ConflictResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: Request) {
    try {
        const products = await prisma.product.findMany({
            include: {
                _count: {
                    select: { images: true }
                },
            }
        });

        if (!products) {
            return NotFoundResponse(null, "Products not found");
        }

        return SuccessResponse(products);
    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function POST(req: Request) {
    try {
        const { name, slug, description, shortDescription, sku, salePrice, price, isSale, quantity, attributes, images } = await req.json();
       
        const fields = pushFieldToFields({ name, slug, description, shortDescription, sku, salePrice, price, isSale, quantity, attributes });

        if (!fields) {
            return FiledsErrorResponse(null, 400, fields);
        }

        const existingProduct = await prisma.product.findUnique({
            where: {
                name
            }
        });

        if (existingProduct) {
            return ConflictResponse(null, "Name already exists");
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                shortDescription,
                sku,
                salePrice: Number(salePrice),
                price: Number(price),
                isSale,
                quantity: Number(quantity),
                attributes
            }
        });

        if (images && images.length > 0) {
            const updatePromises = images.map((image: any) => {
                return prisma.image.update({
                    where: { id: image.id },
                    data: { ...image, productId: product.id }
                });
            });

            await Promise.all(updatePromises);
        }
        return CreatedResponse(product);

    } catch (error) {
      
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { products } = await req.json();

        const response = await prisma.product.updateMany({
            data: products
        });

        return SuccessResponse(response);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { products } = await req.json();

        const response = await prisma.product.deleteMany(products)

        return SuccessResponse(response);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}