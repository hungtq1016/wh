import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { NextRequest } from "next/server";

const { SuccessResponse, InternalServerErrorResponse, NotFoundResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: NextRequest) {

    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '10');
    const pageNumber = parseInt(req.nextUrl.searchParams.get('pageNumber') || '1');
    const searchBy = req.nextUrl.searchParams.getAll('searchBy');
    const searchValue = req.nextUrl.searchParams.getAll('searchValue');
    const orderBy = req.nextUrl.searchParams.get('orderBy') || 'id';
    const orderType = req.nextUrl.searchParams.get('orderType') || 'asc';
    const filterBy = req.nextUrl.searchParams.getAll('filterBy') || [];

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;
    try {
        let data = null;
        let total = 0;

        const searchConditions = searchBy.length && searchValue.length
            ? searchBy.map((field, index) => ({ [field]: { contains: searchValue[index] } }))
            : [];

        const filterByConditions = filterBy.length > 0 ? filterBy.map((field) => ({ [field]: { not: null } })) : [];

        if (searchConditions.length > 0) {

            data = await prisma.image.findMany({
                skip,
                take,
                where: {
                    OR: [
                        {
                            AND: filterByConditions
                        },
                        ...searchConditions
                    ]
                },
                orderBy: { [orderBy]: orderType }
            });
            total = await prisma.image.count({
                where: {
                    OR: [
                        {
                            AND: filterByConditions
                        },
                        ...searchConditions
                    ]
                }
            });
        } else {
            data = await prisma.image.findMany({
                where: {
                    AND: filterByConditions
                },
                skip,
                take,
                orderBy: { [orderBy]: orderType }
            });
            total = await prisma.image.count();
        }

        if (!data) {
            return NotFoundResponse(null, "Images not found");
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

        return SuccessResponse({data,metadata});
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