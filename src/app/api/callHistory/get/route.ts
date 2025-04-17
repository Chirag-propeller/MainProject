// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Metrics from '@/model/metric/metric.model';
//aggregated_metrics



export async function GET() {
  try {
    await dbConnect();
    const data = await Metrics.find({}).limit(100); // limit to avoid large payloads
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
