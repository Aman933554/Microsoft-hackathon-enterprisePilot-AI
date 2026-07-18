import { NextResponse } from 'next/server';
import { runDemo } from '@backend/run-graph';

export const maxDuration = 300; // Allow Vercel/Next to run this for up to 5 mins

export async function POST(req: Request) {
  try {
    const { goal, maxBudget } = await req.json();
    const result = await runDemo(
      goal || "Launch a massive summer marketing campaign for our new product line.", 
      maxBudget || 50000
    );
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
