import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

dbConnect();

export async function POST (req: NextRequest){
    try{
        const body = await req.json();
        const {name, email, password} = body;
        console.log(body);

        // check if user exist
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "User exist already"}, {status:400})
        }
        // hash pass
        const salt = await bcryptjs.genSalt(10);
        const hashPass = await bcryptjs.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPass,
        })
        return NextResponse.json({message: "User created Succesful"}, {status : 201});

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }


}