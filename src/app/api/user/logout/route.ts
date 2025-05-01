import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

export async function POST() {
    try{
        const res = NextResponse.json({ message: "Logout successful" }, { status: 200 })

        res.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
        });
    
        return res;
    }catch(err:any){
        return NextResponse.json({error: err}, {status: 500})
    }

    // NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
