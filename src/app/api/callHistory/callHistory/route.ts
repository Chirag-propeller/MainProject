import CallHistory from "@/model/call/callHistory.model";
import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";
import {  getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";
export async function GET(req : NextRequest) {
    await dbConnect();
    try {
        const user = await getUserFromRequest(req);
        console.log(user);
        // const data = await CallHistory.find({}).limit(100);\
        const userId =  new mongoose.Types.ObjectId(user.userId)
        const data = await OutBoundCall.find({user_id: userId});

        return NextResponse.json({
            success: true,
            data
        }, {status: 200})
    } catch (error : any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, {status: 500})
    }
}
