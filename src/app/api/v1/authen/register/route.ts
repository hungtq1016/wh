import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import * as bcrypt from 'bcrypt';
import TokenHelper from '@/services/helpers/token.helper';
import { pushFieldToFields } from '@/services/utils/string.util';

const { SuccessResponse, InternalServerErrorResponse, FiledsErrorResponse, ConflictResponse } = ResponseHelper();
const { tokenResponse } = TokenHelper();

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
    const token = tokenResponse(newUser);
    return SuccessResponse(token);

  } catch (error) {
    return InternalServerErrorResponse(error);
  }
}