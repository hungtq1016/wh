import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { NextRequest } from "next/server";

const { SuccessResponse, InternalServerErrorResponse, NotFoundResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: NextRequest) {
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '5');
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
            data = await prisma.collectionExhibition.findMany({
                skip,
                take,
                where: {
                    OR: searchConditions
                },
                orderBy: { [orderBy]: orderType },

            });
            total = await prisma.collectionExhibition.count({
                where: {
                    OR: searchConditions
                }
            });
        } else {
            data = await prisma.collectionExhibition.findMany({
                skip,
                take,
                orderBy: { [orderBy]: orderType },
                
            });
            total = await prisma.collectionExhibition.count();
        }

        if (!data) {
            return NotFoundResponse(null, "Collection Exhibitions not found");
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
        const { collectionId, title, desccription, image } = await req.json();
        
        const data = await prisma.collectionExhibition.create({
            data: {
                collectionId, title, desccription, image 
            }
        });

        return CreatedResponse(data);

    } catch (error) {
        console.log(error)
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { collectionExhibition } = await req.json();

        const data = await prisma.collectionExhibition.updateMany({
            data: collectionExhibition
        });

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { collectionExhibition } = await req.json();

        const data = await prisma.collectionExhibition.deleteMany(collectionExhibition)

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}