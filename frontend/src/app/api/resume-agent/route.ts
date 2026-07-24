import { NextResponse } from 'next/server';
import { resumeDemo } from '../../../../../backend/run-graph';
import { currentUser } from '@clerk/nextjs/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const { threadId, approved, email } = await req.json();
    
    // Check if the email passed from the frontend matches the manager email
    const isManager = email === process.env.MANAGER_EMAIL;
    
    if (!isManager) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Only the designated Manager can approve workflows.' }, { status: 403 });
    }

    const logs = await resumeDemo(threadId, approved);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
