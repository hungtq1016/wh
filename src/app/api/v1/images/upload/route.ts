import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import ResponseHelper from "@/services/helpers/response.helper";

const { BadRequestResponse, InternalServerErrorResponse, CreatedResponse } = ResponseHelper();

export const POST = async (req : NextRequest, res: NextResponse) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return BadRequestResponse(null,"No file found");
  }

  const buffer = Buffer.from(await (file as Blob).arrayBuffer());
  const filename = '/'+Date.now() + (file as File).name.replaceAll(" ", "_");

  try {
    await writeFile(
      path.join(process.cwd(), "public" + filename),
      buffer
    );
    return CreatedResponse(filename, "File uploaded successfully");
  } catch (error) {
  
    return InternalServerErrorResponse(error, "Error uploading file");
  }
};