import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import TokenHelper from "@/services/helpers/token.helper";
import { NextRequest } from "next/server";
const { SuccessResponse, UnauthorizedResponse, InternalServerErrorResponse } = ResponseHelper();
const { decodeToken } = TokenHelper();

export async function POST(req:NextRequest) {
    try {
        const authorization = req.headers.get('Authorization');
        const tokens = authorization?.split(' ');

        if (!tokens) {
            return UnauthorizedResponse(null, "Invalid token");
        }

        const token = tokens?.[tokens.length - 1];

        if (!token) {
            return UnauthorizedResponse(null, "Invalid token");
        }

        const data = decodeToken(token);
        
        if (!data) {
            return UnauthorizedResponse(null, "Invalid token");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: data.sub
            }
        });

        if (!user) {
            return UnauthorizedResponse(null, "Unauthorized");
        }

        return SuccessResponse(user);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}