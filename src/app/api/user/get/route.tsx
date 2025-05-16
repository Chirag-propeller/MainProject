import dbConnect from '@/lib/mongodb';
import User from '@/model/user/user.model';
// import User from '@/model/user';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    await dbConnect();

    try {
        const {id} = await req.json();
        const user = await User.findById(id);
        return NextResponse.json( {status: 200, user});
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
 
}
