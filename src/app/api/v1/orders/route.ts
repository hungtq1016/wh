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
            data = await prisma.order.findMany({
                skip,
                take,
                where: {
                    OR: searchConditions
                },
                orderBy: { [orderBy]: orderType }
            
            });
            total = await prisma.order.count({
                where: {
                    OR: searchConditions
                }
            });
        } else {
            data = await prisma.order.findMany({
                skip,
                take,
                orderBy: { [orderBy]: orderType }
            });
            total = await prisma.order.count();
        }

        if (!data) {
            return NotFoundResponse(null, "Orders not found");
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
        const { email, fullName, phoneNumber, address, city, district, ward, note, payment, status } = await req.json();
       
        const data = await prisma.order.create({
            data: {
                email,
                fullName,
                phoneNumber,
                address,
                city,
                district,
                ward,
                note,
                payment : Number(payment),
                status : Number(status)
            }
        });

        return CreatedResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { orders } = await req.json();

        const data = await prisma.order.updateMany({
            data: orders
        });

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { orders } = await req.json();

        const data = await prisma.order.deleteMany(orders)

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}