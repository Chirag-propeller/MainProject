import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/model/agent';

// Next.js 15 route handler signature
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  
  try {
    const agent = await Agent.findOne({ _id: id });
    if (!agent) {
      return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ message: 'Failed to fetch agent' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  const body = await request.json();
  
  try {
    const updatedAgent = await Agent.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedAgent) {
      return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ message: 'Failed to update agent' }, { status: 500 });
  }
}

// import { NextResponse, NextRequest } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Agent from '@/model/agent';

// // The correct way to type params for Next.js route handlers
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const { id } = params;

//   try {
//     const agent = await Agent.findOne({ _id: id });
//     if (!agent) {
//       return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
//     }
//     return NextResponse.json(agent, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching agent:', error);
//     return NextResponse.json({ message: 'Failed to fetch agent' }, { status: 500 });
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const { id } = params;
//   const body = await req.json();

//   try {
//     const updatedAgent = await Agent.findOneAndUpdate(
//       { _id: id },
//       { ...body },
//       { new: true, runValidators: true }
//     );

//     if (!updatedAgent) {
//       return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedAgent }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating agent:', error);
//     return NextResponse.json({ message: 'Failed to update agent' }, { status: 500 });
//   }
// }

// import { NextResponse, NextRequest  } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Agent from '@/model/agent';

// type Params = {
//   params: {
//     id: string;
//   };
// };


// // Define the function signature properly
// export async function GET(
//   req: NextRequest,
//   { params }: Params
//   // { params }: { params: { id: string } }
//   // context: { params: { id: string } }
//   // { params }: { params: { id: string } } 
// ) {
  
//   await dbConnect();

//   // const { id } = await context.params; // Now you can safely access id
//   const { id } = params; // Now you can safely access id

//   try {
//     const agent = await Agent.findOne({ _id: id });
//     if (!agent) {
//       return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
//     }
//     return NextResponse.json(agent, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching agent:', error);
//     return NextResponse.json({ message: 'Failed to fetch agent' }, { status: 500 });
//   }
// }



// // PUT /api/agent/[id]
// export async function PUT(req: NextRequest, 
//   // context: { params: { id: string }}
//   { params }: Params

//  ) {
//   await dbConnect();
//   // const id = await context.params.id;
//   // const id = await context.params.id;
//   const { id } = params;
//   const body = await req.json();

//   try {
//     const updatedAgent = await Agent.findOneAndUpdate(
//       { _id: id },
//       { ...body },
//       { new: true, runValidators: true  }
//     );

//     if (!updatedAgent) {
//       return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedAgent }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating agent:', error);
//     return NextResponse.json({ message: 'Failed to update agent' }, { status: 500 });
//   }
// }

