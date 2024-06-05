import { NextResponse } from 'next/server';
import { convertBigIntToString } from '../utils/string.util';

export default function ResponseHelper() {

    const SuccessResponse = async (data: any, message: string = 'Success') => {
        const responseData = convertBigIntToString(data);
        
        return await NextResponse.json({
            data: responseData,
            message,
            isError: false,
            status: 200,
        }, {
            status: 200
        });
    }

    const CreatedResponse = async (data: any, message: string = 'Created') => {
        const responseData = convertBigIntToString(data);

        return await Response.json({
            data: responseData,
            message,
            isError: false,
            status: 201,
        }, {
            status: 201
        });
    }

    const BadRequestResponse = async (data: any, message: string = 'Bad Request') => {
        return await Response.json({
            data,
            message,
            isError: true,
            status: 400,
        }, {
            status: 400
        });
    }

    const UnauthorizedResponse = async (data: any, message: string = 'Unauthorized') => {
        return await Response.json({
            data,
            message,
            isError: true,
            status: 401,
        }, {
            status: 401
        });
    }

    const ForbiddenResponse = async (data: any, message: string = 'Forbidden') => {
        return await Response.json({
            data,
            message,
            isError: true,
            status: 403,
        }, {
            status: 403
        });
    }

    const NotFoundResponse = async (data: any, message: string = 'Not Found') => {
        return await Response.json({
            data,
            message,
            isError: true,
            status: 404,
        }, {
            status: 404
        });
    }

    const ConflictResponse = async (data: any, message: string = 'Conflict') => {
        return await Response.json({
            data,
            message,
            isError: true,
            status: 409,
        }, {
            status: 409
        });
    }

    const InternalServerErrorResponse = async (data: any, message: string = 'Internal Server Error') => {
        return await Response.json({
            data,
            message,
            isError: true,
            status: 500,
        }, {
            status: 500
        });
    }

    const CustomErrorResponse = async (data: any, status: number, message: string) => {
        return await Response.json({
            data,
            message,
            isError: true,
            status,
        }, {
            status
        });
    }

    const FiledsErrorResponse = (data: any, status: number, fields: { field: string, message: string }[], error: boolean = true) => {
        return Response.json({
            data,
            message: 'Invalid Fields',
            isError: error,
            status,
            fields
        }, {
            status
        });
    }

    return {
        SuccessResponse,
        CreatedResponse,
        BadRequestResponse,
        UnauthorizedResponse,
        ForbiddenResponse,
        NotFoundResponse,
        ConflictResponse,
        InternalServerErrorResponse,
        CustomErrorResponse,
        FiledsErrorResponse
    }
}