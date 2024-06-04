import { prisma } from "@/libs/db";
import ResponseHelper from '@/services/helpers/response.helper';
import TokenHelper from "@/services/helpers/token.helper";
import axios from "axios";
import { NextRequest } from "next/server";

const { SuccessResponse, UnauthorizedResponse, InternalServerErrorResponse } = ResponseHelper();
const { tokenResponse } = TokenHelper();

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const code = searchParams.get('code')

        const clientID = process.env.GITHUB_CLIENT_ID || 'Ov23livAwETyrWRpJcY6';
        const clientSecret = process.env.GITHUB_CLIENT_SECRET || '6681b49f6232d80239626a8a36d2ad63122e5875';

        const { data } = await axios.post(`https://github.com/login/oauth/access_token`, null, {
            params: { client_id: clientID, client_secret: clientSecret, code },
            headers: { accept: 'application/json' }
        });

        const { access_token } = data;
        if (!access_token) return UnauthorizedResponse(null, "Unauthorized");

        const userProfile = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${access_token}` }
        });

        let user = await prisma.user.findUnique({ where: { email: `${
            userProfile.data.login
        }@github.com` } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: `${
                        userProfile.data.login
                    }@github.com`,
                    fullName: userProfile.data.name,
                    password: '',
                    phoneNumber: ''
                }
            });
        }

        const token = tokenResponse(user);

        return SuccessResponse(token);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}