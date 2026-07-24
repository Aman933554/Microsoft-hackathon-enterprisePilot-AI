import { NextResponse } from 'next/server';
import { threadStatuses } from '../../../../../backend/run-graph';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");
  
  if (!threadId || !threadStatuses[threadId]) {
    return NextResponse.json({ resolved: false });
  }

  return NextResponse.json(threadStatuses[threadId]);
}
