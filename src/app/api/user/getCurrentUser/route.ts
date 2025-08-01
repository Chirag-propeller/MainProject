import { getUserFromRequest } from "@/lib/auth";
import User from "@/model/user/user.model";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    await dbConnect();
    try {
        const user = await getUserFromRequest(req);
        const currentUser = await User.findById(user.userId);
        
        // console.log('getCurrentUser API called. Returning user data:', {
        //     email: currentUser?.email,
        //     name: currentUser?.name,
        //     timestamp: new Date().toISOString()
        // });
        
        return NextResponse.json(currentUser);
    } catch (error : any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}