import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies(); // ✅ no await needed in latest Next.js
    // cookieStore.delete("token");

    const tokenBefore:any = cookieStore.get("token");
    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      message: "Logout attempted",
      tokenBeforeLogout: tokenBefore?.value,
      path: tokenBefore?.path,
      secure: tokenBefore?.secure,
      isProduction:isProduction,
    });

    
    (await cookies()).set('token', '', { maxAge: 0 })
    // response.cookies.set({
    //   name: "token",
    //   value: "",
    //   expires: new Date(0),
    //   httpOnly: true,
    //   path: "/",
    //   secure: isProduction,
    //   sameSite: "lax",
    // });

    return response;
    // const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    // const isProduction = process.env.NODE_ENV === 'production';
    // response.cookies.set({
    //   name: "token",
    //   value: "",
    //   expires: new Date(0),
    //   httpOnly: true,
    //   path: "/",
    //   secure: isProduction, // Match the 'secure' value used during login
    //   sameSite: 'lax',
    // });

    // return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

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
