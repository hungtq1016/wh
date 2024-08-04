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
            data = await prisma.billBoard.findMany({
                skip,
                take,
                where: {
                    OR: searchConditions
                },
                orderBy: { [orderBy]: orderType },
                
                include: { 
                    _count: { select: { images: true } },
                    images : {
                        select : {
                            id: true,
                            url: true,
                            alt: true
                        },
                        take: 1,
                        orderBy: { updatedAt: 'desc' }
                    }
                }
            });
            total = await prisma.billBoard.count({
                where: {
                    OR: searchConditions
                }
            });
        } else {
            data = await prisma.billBoard.findMany({
                skip,
                take,
                orderBy: { [orderBy]: orderType },
                include: { 
                    _count: { select: { images: true } },
                }
            });
            total = await prisma.billBoard.count();
        }

        if (!data) {
            return NotFoundResponse(null, "Billboards not found");
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
        const { id, title, content, link, position, images } = await req.json();
        
        const data = await prisma.billBoard.create({
            data: {
                id, title, content, link, position
            }
        });

        if (images && images.length > 0) {
            const updatePromises = images.map((image: any) => {
                return prisma.image.update({
                    where: { id: image.id },
                    data: { ...image, billBoardId: data.id }
                });
            });

            await Promise.all(updatePromises);
        }

        return CreatedResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { billboards } = await req.json();

        const data = await prisma.billBoard.updateMany({
            data: billboards
        });

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { billboards } = await req.json();

        const data = await prisma.billBoard.deleteMany(billboards)

        return SuccessResponse(data);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}