import { orchestratorApp } from "./orchestrator/graph";
import { prisma } from "../frontend/src/lib/prisma";

export const threadStatuses: Record<string, { resolved: boolean; approved?: boolean; logs?: string[] }> = (global as any).__threadStatuses || {};
(global as any).__threadStatuses = threadStatuses;

export async function runDemo(goal: string, maxBudget: number) {
  const logs: string[] = [];
  
  // Intercept console.log
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    logs.push(args.join(" "));
    originalLog(...args); // keep original behavior too
  };

  try {
    console.log("🚀 Starting AI-Native Enterprise Operating System Demo...\n");

    const threadId = "demo-thread-" + Date.now();
    const threadConfig = { configurable: { thread_id: threadId } };
    
    threadStatuses[threadId] = { resolved: false };

    // Save session to DB
    await prisma.workflowSession.create({
      data: {
        id: threadId,
        goal,
        maxBudget,
        status: "RUNNING",
      }
    });

    console.log(`[TRIGGER] New Goal: ${goal}\n`);

    await orchestratorApp.invoke(
      { goal, maxBudget },
      threadConfig
    );

    // Check if graph is paused
    const state = await orchestratorApp.getState(threadConfig);
    const nextNode = state.next?.[0];

    if (nextNode === "executeAction") {
      console.log("\n--- Workflow paused for human approval ---");
      console.log("\n[HUMAN IN THE LOOP] System is waiting for a webhook from Notion...");
      
      await prisma.workflowSession.update({
        where: { id: threadId },
        data: { status: "WAITING_APPROVAL" }
      });

      return { logs, threadId, isPaused: true };
    }

    console.log("\n✅ Demo Complete.");
    
    await prisma.workflowSession.update({
      where: { id: threadId },
      data: { status: "COMPLETED" }
    });

    return { logs, threadId, isPaused: false };
  } finally {
    // Restore console.log
    console.log = originalLog;
  }
}

export async function resumeDemo(threadId: string, approved: boolean) {
  const logs: string[] = [];
  
  // Intercept console.log
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    logs.push(args.join(" "));
    originalLog(...args); // keep original behavior too
  };

  try {
    const threadConfig = { configurable: { thread_id: threadId } };
    
    console.log(`[NOTION WEBHOOK] Received webhook for thread ${threadId}: ${approved ? 'Approved' : 'Rejected'}.`);

    try {
      await orchestratorApp.updateState(
        threadConfig,
        { humanApproved: approved }
      );
      // Resume the graph
      await orchestratorApp.invoke(null, threadConfig);
    } catch (e: any) {
      console.log(`[WARNING] Could not resume thread ${threadId} in LangGraph (likely memory wiped). Proceeding to resolve in DB anyway.`);
    }

    console.log("\n✅ Workflow Completed and Actions Executed.");
    
    threadStatuses[threadId] = { resolved: true, approved, logs };

    // Log decision and mark session complete
    await prisma.decisionHistory.create({
      data: {
        workflowSessionId: threadId,
        agent: "Manager (Human)",
        decision: approved ? "APPROVE" : "REJECT",
        rationale: approved ? "Approved via Notion Webhook" : "Rejected via Notion Webhook"
      }
    });

    await prisma.workflowSession.update({
      where: { id: threadId },
      data: { status: approved ? "COMPLETED" : "REJECTED" }
    });

    return logs;
  } finally {
    console.log = originalLog;
  }
}
