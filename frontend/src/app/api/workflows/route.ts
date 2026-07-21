import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const workflows = await prisma.workflowSession.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        decisions: true
      }
    });
    return NextResponse.json({ success: true, workflows });
  } catch (error: any) {
    console.error("API Error (Workflows):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
