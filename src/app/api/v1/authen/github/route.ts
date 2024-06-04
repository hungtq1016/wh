import ResponseHelper from '@/services/helpers/response.helper';

const { InternalServerErrorResponse } = ResponseHelper();

export async function GET() {
    try {
        const clientID = process.env.GITHUB_CLIENT_ID;
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user:email`;
        return Response.redirect(githubUrl);
    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}