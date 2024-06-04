import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import { pushFieldToFields } from '@/services/utils/string.util';
import * as bcrypt from 'bcrypt';

const { SuccessResponse, InternalServerErrorResponse, FiledsErrorResponse, NotFoundResponse, ConflictResponse, CreatedResponse } = ResponseHelper();

export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany();

        if (!users) {
            return NotFoundResponse(null, "Users not found");
        }

        return SuccessResponse(users);
    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function POST(req: Request) {
    try {
        const { email, password, fullName, phoneNumber } = await req.json();

        const fields = pushFieldToFields({ email, password, fullName, phoneNumber });

        if (!fields) {
            return FiledsErrorResponse(null, 400, fields);
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (user) {
            return ConflictResponse(null, "Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                phoneNumber
            }
        });

        return CreatedResponse(newUser);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function PUT(req: Request) {
    try {
        const { users } = await req.json();

        const response = await prisma.user.updateMany({
            data: users
        });

        return SuccessResponse(response);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    try {
        const { users } = await req.json();

        const response = await prisma.user.deleteMany(users)

        return SuccessResponse(response);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}