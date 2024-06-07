import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { pushFieldToFields } from '@/services/utils/string.util';
import { NextRequest } from "next/server";

const { SuccessResponse, InternalServerErrorResponse, FiledsErrorResponse, NotFoundResponse, ConflictResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: NextRequest) {
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '10');
    const pageNumber = parseInt(req.nextUrl.searchParams.get('pageNumber') || '1');
    const searchBy = req.nextUrl.searchParams.getAll('searchBy');
    const searchValue = req.nextUrl.searchParams.getAll('searchValue');
    const orderBy = req.nextUrl.searchParams.get('orderBy') || 'updatedAt';
    const orderType = req.nextUrl.searchParams.get('orderType') || 'desc';

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    try {
        let data = null;
        let total = 0;
        const searchConditions = searchBy.length && searchValue.length 
            ? searchBy.map((field, index) => ({ [field]: { contains: searchValue[index] } })) 
            : [];

        if (searchConditions.length > 0) {
            data = await prisma.product.findMany({
                skip,
                take,
                where: {
                    OR: searchConditions
                },
                orderBy: { [orderBy]: orderType },
                include: { _count: { select: { images: true } } }
            });
            total = await prisma.product.count({
                where: {
                    OR: searchConditions
                }
            });
        } else {
            data = await prisma.product.findMany({
                skip,
                take,
                orderBy: { [orderBy]: orderType },
                include: { _count: { select: { images: true } } }
            });
            total = await prisma.product.count();
        }

        if (!data) {
            return NotFoundResponse(null, "Products not found");
        }

        const lastPage = Math.ceil(total / pageSize);
        const metadata = {
            total,
            pageSize,
            pageNumber,
            searchBy,
            searchValue,
            orderBy,
            orderType,
            nextPage: pageNumber < lastPage ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            firstPage: 1,
            lastPage
        };

        return SuccessResponse({ data, metadata });
    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}


export async function POST(req: Request) {
    try {
        const { name, slug, description, about, sku, salePrice, price, isSale, quantity, attributes, images } = await req.json();
       
        const fields = pushFieldToFields({ name, slug, description, about, sku, salePrice, price, isSale, quantity, attributes });

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
                about,
                sku,
                salePrice : String(salePrice),
                price : String(price),
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