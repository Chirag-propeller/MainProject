import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/model/agent';
import { getUserFromRequest } from '@/lib/auth';


export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    let user= await getUserFromRequest(req);
    // try {
      
    // } catch (error) {
    //   return NextResponse.json({ message: 'Unauthorized', error: error }, { status: 401 });
    // }
   
    const agents = await Agent.find({ userId: user.userId }).sort({ createdAt: -1 });
    return NextResponse.json(agents, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
