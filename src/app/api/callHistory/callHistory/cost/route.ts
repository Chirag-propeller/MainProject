// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AggregatedMetrics from '@/model/metric/aggregatedMetrics.model';



export async function GET() {
  try {
    await dbConnect();
    console.log("aggregated matrix route")
    
    const data = await AggregatedMetrics.find({}).limit(100); // limit to avoid large payloads
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
