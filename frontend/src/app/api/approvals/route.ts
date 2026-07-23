import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pendingApprovals = await prisma.workflowSession.findMany({
      where: {
        status: 'WAITING_APPROVAL',
      },
      orderBy: { createdAt: 'desc' }
    });
    const historyApprovals = await prisma.workflowSession.findMany({
      where: {
        status: { in: ['COMPLETED', 'REJECTED'] },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });
    return NextResponse.json({ success: true, pendingApprovals, historyApprovals });
  } catch (error: any) {
    console.error("API Error (Approvals):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
