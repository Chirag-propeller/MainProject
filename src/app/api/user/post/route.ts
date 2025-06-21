import { getUserFromRequest } from "@/lib/auth";
import User from "@/model/user/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userData = await getUserFromRequest(req);
    const userId = userData?.userId;
    const { callHistoryFields } = await req.json();
    const _id = new mongoose.Types.ObjectId(userId);
    const user = await User.findOneAndUpdate({ _id }, { callHistoryFields: callHistoryFields }, { new: true });

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "User found" }, { status: 200 });
}






// import { getUserFromRequest } from "@/lib/auth";
// import User from "@/model/user/user.model";
// import mongoose from "mongoose";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     const userData = await getUserFromRequest(req);
//     const userId = userData?.userId;
//     const { data } = await req.json();
//     const _id = new mongoose.Types.ObjectId(userId);
//     const userObj = await User.findOne({ _id });
//     const dataToUpdate = {
//         ...userObj,
//         data
//     }
//     const user = await User.findOneAndUpdate({ _id }, dataToUpdate, { new: true });

//     if (!userId) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     return NextResponse.json({ message: "User found" }, { status: 200 });
// }
