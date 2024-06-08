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
            data = await prisma.policy.findMany({
                skip,
                take,
                where: {
                    OR: searchConditions
                },
                orderBy: { [orderBy]: orderType }
            
            });
            total = await prisma.policy.count({
                where: {
                    OR: searchConditions
                }
            });
        } else {
            data = await prisma.policy.findMany({
                skip,
                take,
                orderBy: { [orderBy]: orderType }
            });
            total = await prisma.policy.count();
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
        const exist = await prisma.policy.count()

        if (exist > 0) {
            return ConflictResponse(null, "Only one policy is allowed");
        }

        const { title, content, suffix } = await req.json();
       

        const data = await prisma.policy.create({
            data: {
                title,
                content,
                suffix
            }
        });

        return CreatedResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { policies } = await req.json();

        const data = await prisma.policy.updateMany({
            data: policies
        });

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { policies } = await req.json();

        const data = await prisma.policy.deleteMany(policies)

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}