import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
// import { StatusCodes, ErrorCodes } from '@/constants/status-codes';
import { ApiResponse } from "@/types/api-response";
import { signUpSchema } from "@/lib/validators/auth.schema";
import { ErrorCodes,StatusCodes } from "@/constants/status-codes";
import { successResponse, errorResponse } from "@/lib/api/response";

dbConnect();

export async function POST (req: NextRequest){
    try{
        const body = await req.json();
        const result = signUpSchema.safeParse(body);

        if (!result.success) {
            return errorResponse(
              "Validation failed",
              ErrorCodes.VALIDATION_ERROR,
              StatusCodes.BAD_REQUEST,
              result.error.flatten()
            );
          }

        let {name, email, password} = body;
        console.log(body);
        email = email.toLowerCase();
        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.isVerified) {
              return errorResponse(
                "User already exists",
                ErrorCodes.VALIDATION_ERROR,
                StatusCodes.BAD_REQUEST
              );
            } else {
              console.log("Not verified");
              await User.deleteOne({ _id: existingUser._id });
            }
          }
        // hash pass
        const salt = await bcryptjs.genSalt(10);
        const hashPass = await bcryptjs.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPass,
            isVerified:false,
        })
        return successResponse(
            { userId: newUser._id },
            "User created successfully",
            StatusCodes.OK
          );

    }catch(err: any){
        console.error("Signup Error:", err);
        return errorResponse(
          "Internal server error",
          ErrorCodes.SERVER_ERROR,
          StatusCodes.INTERNAL_ERROR
        );
    }
}