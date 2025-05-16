import CallHistory from "@/model/call/callHistory.model";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";

export async function GET() {
    await dbConnect();
    try {
        // const data = await CallHistory.find({}).limit(100);
        const data = await OutBoundCall.find({}).limit(250);
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
