import ResponseHelper from '@/services/helpers/response.helper';
import axios from "axios";
import { NextRequest } from "next/server";

const { SuccessResponse, InternalServerErrorResponse } = ResponseHelper();

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const code = searchParams.get('code')
        
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUrl = process.env.GOOGLE_REDIRECT_URL;

        const { data } = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUrl,
                grant_type: 'authorization_code'
            }
        });

        const { access_token } = data;
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        return SuccessResponse(profile);

    } catch (error) {
        return InternalServerErrorResponse(error);
    }
}