import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch aggregated data
    const aggregations = await prisma.workflowSession.aggregate({
      _count: { id: true },
      _sum: { budgetSavings: true, durationMs: true },
    });

    const totalWorkflows = aggregations._count.id;
    const totalValueCreated = aggregations._sum.budgetSavings || 0;
    const totalDurationMs = aggregations._sum.durationMs || 0;
    const totalTimeSavedHrs = Math.round(totalDurationMs / (1000 * 60 * 60)) || 0; 
    
    // In our domain, 1 workflow is estimated to cost ₹8.8 on average.
    const totalApiCost = totalWorkflows * 8.8;

    // Decisions
    const totalDecisions = await prisma.decisionHistory.count();
    
    // Human Input required (approvals requested by HumanManager or similar)
    const humanInputCount = await prisma.decisionHistory.count({
      where: {
        agent: {
          contains: 'Human', // e.g., 'HumanManager', 'Human Approval Agent'
        }
      }
    });

    // Fetch minimal workflow data to compute risk distribution and chart activity
    const workflows = await prisma.workflowSession.findMany({
      select: {
        riskScore: true,
        createdAt: true,
      }
    });

    let lowRiskCount = 0;
    let medRiskCount = 0;
    let highRiskCount = 0;

    // Chart array [Jan, Feb, Mar, ..., Dec] initialized to 0
    const monthlyActivity = new Array(12).fill(0);

    workflows.forEach(w => {
      // Risk distribution
      if (w.riskScore < 30) lowRiskCount++;
      else if (w.riskScore <= 60) medRiskCount++;
      else highRiskCount++;

      // Chart Activity (group by month)
      const monthIndex = new Date(w.createdAt).getMonth();
      monthlyActivity[monthIndex]++;
    });

    // To make the chart look like 'tokens' or a scaled metric, we can scale it, 
    // but the user wants real data. If there are only 5 workflows, the chart will be tiny.
    // We'll pass the raw counts and the frontend can decide how to render.

    return NextResponse.json({
      success: true,
      metrics: {
        totalValueCreated,
        totalDecisions,
        humanInputCount,
        totalApiCost,
        totalTimeSavedHrs,
        totalWorkflows
      },
      risk: {
        low: lowRiskCount,
        medium: medRiskCount,
        high: highRiskCount
      },
      chartData: monthlyActivity
    });

  } catch (error: any) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
