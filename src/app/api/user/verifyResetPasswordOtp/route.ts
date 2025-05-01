import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    await dbConnect();
    try {
        const body = await req.json();
        let {otp, email} = body;
        email = email.toLowerCase();
        if (!email || !otp) {
            return Response.json({ message: "Missing email or OTP." }, { status: 400 });
          }
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "User dont exist" , status : 404});
        }


        if(user.forgotPasswordToken !== otp){
             return NextResponse.json({error: "Otp is not correct" , status : 400});
        }
      
        if (!user.forgotPasswordTokenExpiry || new Date(user.forgotPasswordTokenExpiry).getTime() < Date.now()) {
            return Response.json({ message: "OTP expired. Please request a new one." }, { status: 400 });
        }

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({sucess: "Otp is correct" , status: 200});
    } catch (error:any) {
        return Response.json({ error: error.message || error }, { status: 500 });   
    }
}