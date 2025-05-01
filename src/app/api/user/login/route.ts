import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"


dbConnect()

export async function POST(req : NextRequest){

    try {
        const body = await req.json();

          
        const {email, password} = body;
        console.log(email, password);
        const emailToCheck = email.toLowerCase();
        const user = await User.findOne({email: emailToCheck});
        console.log(user);
        if(user === null){
            return NextResponse.json({ error:"User don't Exist"}, {status: 400});
        }
        if(!user.password){
            return NextResponse.json({ error:"Please provide the password."}, {status: 401});
        }
        console.log(password);
        console.log(user.password);
        if(!user.isVerified ){
            return NextResponse.json({error: "User is not verified"}, {status: 402});
        }

        const checkPass = await bcrypt.compare(password, user.password);
        console.log(checkPass);
        if (!checkPass) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
          }
        const tokenData = {
            userId : user._id,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "3d"});
        const response = NextResponse.json({message:"Login Successful", success: true}, {status: 200});
        response.cookies.set("token",token,
            {
                httpOnly: true,
                path: "/",
            },

        )
        return response;
    }catch(err:any){
        return NextResponse.json({error: err}, {status: 500})
    }

}


