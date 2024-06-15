import ResponseHelper from '@/services/helpers/response.helper';
import { put } from '@vercel/blob';

const { InternalServerErrorResponse, CreatedResponse } = ResponseHelper();

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const fileName = searchParams.get('filename');
    const randomName = Date.now().toString();

    const nameOfFile = fileName || randomName;
    let blob = null

    if(request.body){
      blob = await put(nameOfFile, request.body, {
        access: 'public',
      });
    }
    return CreatedResponse(blob,"File uploaded successfully");
  } catch (error) {
    
    return InternalServerErrorResponse(error);
  }
}
