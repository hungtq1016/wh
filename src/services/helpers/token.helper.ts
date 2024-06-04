import { TUser } from "@/libs/models/type";
import { AddTimeToDateNow } from "../utils/date.util";
import { Base64UrlEncode } from "../utils/string.util";
import * as crypto from 'crypto';

export default function TokenHelper(){

    const secretJWTKey = process.env.SECRET_JWT_KEY || 'This!Is@NotSecret#JWT$Key'

    const generateToken = (user: TUser): string => {

        const header = {
            alg: "HS256",
            typ: "JWT"
        };

        const payload = {
            sub: user.id,
            expiresIn: AddTimeToDateNow(process.env.ACCESS_TOKEN_LIFETIME || '1h')
        };

        const encodedHeader = Base64UrlEncode(JSON.stringify(header));
        const encodedPayload = Base64UrlEncode(JSON.stringify(payload));
        const encodedData = `${encodedHeader}.${encodedPayload}`;
        const signature = createSignature(encodedData);

        return `${encodedData}.${signature}`;
    }

    const verifyToken = (token: string): boolean => {
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        const encodedData = `${encodedHeader}.${encodedPayload}`;
        const newSignature = createSignature(encodedData);

        return signature === newSignature;
    }

    const decodeToken = (token: string): any => {
        const [, encodedPayload] = token.split('.');
        const data = Buffer.from(encodedPayload, 'base64url').toString('utf-8');

        return JSON.parse(data);
    }

    const refreshToken = (token: string): string | null => {
        if (!verifyToken(token)) return null;

        const [encodedHeader, encodedPayload] = token.split('.');
        const encodedData = `${encodedHeader}.${encodedPayload}`;
        const newSignature = createSignature(encodedData);

        return `${encodedData}.${newSignature}`;
    }

    const tokenResponse = (user: TUser) => {
        const token = generateToken(user);

        return {
            accessToken: token,
            refreshToken: 'newFeature',
            expireId: AddTimeToDateNow(process.env.ACCESS_TOKEN_LIFETIME || '1h'),
            tokenType: 'Bearer'
        };
    }

    const createSignature = (data: string): string => {
        return crypto.createHmac('sha256', secretJWTKey).update(data).digest('base64url');
    }

    return { generateToken, verifyToken, decodeToken, refreshToken, tokenResponse }
}