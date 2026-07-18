import { NextResponse } from 'next/server';
import { resumeDemo } from '@backend/run-graph';

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { threadId, approved } = await req.json();
    const logs = await resumeDemo(threadId, approved);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
