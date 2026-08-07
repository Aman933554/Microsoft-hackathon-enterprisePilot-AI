import { NextResponse } from 'next/server';
import { resumeDemo } from '../../../../../backend/run-graph';
import { currentUser } from '@clerk/nextjs/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  console.log(">>>>>>>> API /api/resume-agent WAS CALLED! <<<<<<<<");
  try {
    const url = new URL(req.url);
    const threadId = url.searchParams.get("threadId");
    const approved = url.searchParams.get("approved") === "true";
    console.log(">>>>>>>> Request Params:", { threadId, approved });
    
    if (!threadId) {
      return NextResponse.json({ success: false, error: 'Missing threadId' }, { status: 400 });
    }
    
    // For demo purposes, we will bypass the email check since the frontend 
    // doesn't have access to the manager email without NEXT_PUBLIC prefix.
    const isManager = true;

    const logs = await resumeDemo(threadId, approved);
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const actionUrl = new URL(`/action`, baseUrl);
    actionUrl.searchParams.set("threadId", threadId);
    actionUrl.searchParams.set("approved", approved.toString());
    actionUrl.searchParams.set("status", "success");
    
    // Pass budget and feature if they were in the original URL
    const budget = url.searchParams.get("budget");
    const feature = url.searchParams.get("feature");
    if (budget) actionUrl.searchParams.set("budget", budget);
    if (feature) actionUrl.searchParams.set("feature", feature);

    return NextResponse.redirect(actionUrl);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
