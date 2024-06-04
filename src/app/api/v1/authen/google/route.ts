import ResponseHelper from '@/services/helpers/response.helper';

const { InternalServerErrorResponse } = ResponseHelper();

export async function GET() {
    try {
        const clientID = process.env.GOOGLE_CLIENT_ID;
        const redirectUrl = process.env.GOOGLE_REDIRECT_URL;
        const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectUrl}&response_type=code&scope=profile email`;
        return Response.redirect(googleUrl);
    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}