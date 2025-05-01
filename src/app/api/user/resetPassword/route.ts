import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    await dbConnect();
    try {
        const body = await req.json();
        let {email, newPassword} = body;
        email = email.toLowerCase();
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "Invalid User."}, {status: 400});
        }
        const salt = await bcryptjs.genSalt(10);
        const hashPass = await bcryptjs.hash(newPassword, salt);
        user.password = hashPass;
        await user.save();
        return NextResponse.json({success: "Password Reset"}, {status:200});


    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status:500})
    }
}
