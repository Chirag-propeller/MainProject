import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies(); // ✅ no await needed in latest Next.js

    cookieStore.set({
      name: "token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// // import { cookies } from "next/headers";

// export async function POST() {
//     try{
//         const res = NextResponse.json({ message: "Logout successful" }, { status: 200 })

//         res.cookies.set("token", "", {
//         httpOnly: true,
//         expires: new Date(0),
//         path: "/",
//         });
    
//         return res;
//     }catch(err:any){
//         return NextResponse.json({error: err}, {status: 500})
//     }

//     // NextResponse.json({ message: "Logout successful" }, { status: 200 });
// }
