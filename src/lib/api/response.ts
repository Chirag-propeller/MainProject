import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api-response";

export const successResponse = <T>(
  data: T,
  message = "Success",
  statusCode = 200
) => {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
      statusCode,
    },
    { status: statusCode }
  );
};

export const errorResponse = (
  message: string,
  errorCode: string,
  statusCode = 500,
  data?: any
) => {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      errorCode,
      statusCode,
      ...(data && { data }), // include data only if present
    },
    { status: statusCode }
  );
};
