// app/api/agent/create/route.ts
import { NextResponse , NextRequest} from 'next/server';
import dbConnect from '@/lib/mongodb'; // Update this if your path is different
import Agent from '@/model/agent'; // Make sure this is correct path
import { getUserFromRequest } from '@/lib/auth';
import User from '@/model/user/user.model';


export async function POST(req: NextRequest) {



  try {
    const body = await req.json();
    // if (!body.name || !body.description) {
    //     return NextResponse.json({ success: false, error: 'Name and Description are required' }, { status: 400 });
    //   }
    await dbConnect();
    const user = await getUserFromRequest(req);
    console.log(user);
    let {agentName} = body;
    // console.log(agentName);
    // if(agentName.trim() === ""){
    //   agentName = "Agent 1"
    // }
    // console.log(agentName);
    const newAgent = await Agent.create({
      agentId: Date.now().toString(), // Temp incremental ID
      userId: user.userId,
      ...body,
      agentName: agentName.trim() === "" ? "Agent 1" : agentName,
    });
    console.log(newAgent);
    await User.findByIdAndUpdate(user.userId, { $push: { agents: newAgent._id } });

    return NextResponse.json({ success: true, data: newAgent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 });
  }
}
