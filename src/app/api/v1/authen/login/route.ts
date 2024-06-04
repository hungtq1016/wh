import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import * as bcrypt from 'bcrypt';
import TokenHelper from '@/services/helpers/token.helper';

const { SuccessResponse, UnauthorizedResponse, InternalServerErrorResponse } = ResponseHelper();
const { tokenResponse } = TokenHelper();
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
        where: {
        email
        }
    });

    if (!user) {
        return UnauthorizedResponse(null, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return UnauthorizedResponse(null, "Invalid email or password");
    }
    const token = await tokenResponse(user);
    return SuccessResponse(token);

  } catch (error) {
    return InternalServerErrorResponse(error);
  }
}