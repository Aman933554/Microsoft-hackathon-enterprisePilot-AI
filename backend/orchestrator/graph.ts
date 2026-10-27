import { StateGraph, START, END, MemorySaver, Annotation } from "@langchain/langgraph";
import { EngineeringAgent } from "../agents/engineering";
import { FinanceAgent } from "../agents/finance";
import { QAAgent } from "../agents/qa";
import { AgentNotionClient } from "../notion/client";
import { sendSlackMessage } from "../tools/slack";
import { sendApprovalEmail, sendNotificationEmail } from "../tools/email";
import { createGithubIssue, createGithubPullRequest } from "../tools/github";
import { createCalendarEvent } from "../tools/calendar";
import { prisma } from "../../frontend/src/lib/prisma";

export const GraphState = Annotation.Root({
  goal: Annotation<string>(),
  maxBudget: Annotation<number>(),
  proposal: Annotation<any>(),
  budgetApprovedByFinance: Annotation<boolean>(),
  financeFeedback: Annotation<string>(),
  financeAnalysis: Annotation<any>(),
  qaChecklist: Annotation<any>(),
  qaAnalysis: Annotation<any>(),
  notionPageId: Annotation<string>(),
  humanApproved: Annotation<boolean>(),
  negotiationRound: Annotation<number>(),
  userEmail: Annotation<string | undefined>(),
});

const engineeringAgent = new EngineeringAgent();
const financeAgent = new FinanceAgent();
const qaAgent = new QAAgent();

const engineeringNotion = new AgentNotionClient("Engineering", process.env.NOTION_ENGINEERING_TOKEN || process.env.NOTION_TOKEN);
const financeNotion = new AgentNotionClient("Finance", process.env.NOTION_FINANCE_TOKEN || process.env.NOTION_TOKEN);

async function logAudit(threadId: string, agent: string, reason: string, status: string, input?: string, output?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        workflowSessionId: threadId,
        agent,
        reason,
        status,
        input: input || null,
        output: output || null
      }
    });
  } catch (e) {
    console.error("Failed to log audit", e);
  }
}

async function engineeringNode(state: typeof GraphState.State, config?: any) {
  const threadId = config?.configurable?.thread_id;
  let newProposal;
  
  const currentRound = state.negotiationRound || 0;
  const newRound = state.proposal ? currentRound + 1 : 1;

  if (!state.proposal) {
    newProposal = await engineeringAgent.proposeImplementation(state.goal, state.maxBudget);
    if (threadId) await logAudit(threadId, "Engineering", "Initial Architecture Proposal", "SUCCESS", state.goal, JSON.stringify(newProposal));
  } else {
    const revised = await engineeringAgent.reviseBudget(state.proposal, state.financeFeedback);
    newProposal = { ...state.proposal, budget: revised.budget, revisedDescription: revised.revisedDescription, analysis: revised.analysis };
    if (threadId) await logAudit(threadId, "Engineering", "Revised Architecture Proposal based on Finance feedback", "SUCCESS", state.financeFeedback, JSON.stringify(newProposal));
  }
  
  await engineeringNotion.logCampaignProposal({
    title: newProposal.title,
    budget: newProposal.budget,
    status: "Draft",
    rationale: state.financeFeedback ? `Revised based on Finance feedback: ${state.financeFeedback}\nCuts: ${newProposal.revisedDescription}` : "Initial proposal generated for goal"
  });

  return { proposal: newProposal, negotiationRound: newRound };
}

async function financeNode(state: typeof GraphState.State, config?: any) {
  const threadId = config?.configurable?.thread_id;
  const result = await financeAgent.reviewBudget(state.proposal.budget, state.maxBudget, state.goal);
  if (threadId) await logAudit(threadId, "Finance", "Budget Review", result.approved ? "APPROVED" : "REJECTED", JSON.stringify({ budget: state.proposal.budget, maxBudget: state.maxBudget }), JSON.stringify(result));
  
  return { 
    budgetApprovedByFinance: result.approved,
    financeFeedback: result.feedback || "",
    financeAnalysis: result.analysis
  };
}

async function qaNode(state: typeof GraphState.State, config?: any) {
  const threadId = config?.configurable?.thread_id;
  const result = await qaAgent.generateChecklist(state.proposal);
  console.log(`[QA AGENT] Evaluated risk as ${result.riskLevel}. Generated checklist.`);
  if (threadId) await logAudit(threadId, "QA", "Risk Assessment & Checklist Generation", "SUCCESS", JSON.stringify(state.proposal), JSON.stringify(result));
  
  return { qaChecklist: result, qaAnalysis: result.analysis };
}

async function requestHumanApprovalNode(state: typeof GraphState.State, config?: any) {
  const threadId = config?.configurable?.thread_id || "demo-thread";
  const pageId = await financeNotion.requestHumanApproval(state.proposal, state.financeFeedback || "QA Checklist Generated.", state.qaChecklist);
  console.log(`\n*** ORCHESTRATOR PAUSED ***`);
  console.log(`[SYSTEM] Creating Approval Request in Notion using Finance Token via MCP protocol...`);
  
  await sendApprovalEmail(state.proposal.budget, state.proposal.title, threadId);

  console.log(`[SLACK] 🚨 Approval Required for Engineering Budget: ₹${state.proposal.budget}. Risk: ${state.qaChecklist?.riskLevel}. Review in Notion.`);
  console.log(`[SYSTEM] 🔔 Triggered Browser Push Notification: "Waiting for Manager Approval".`);
  console.log(`Workflow is waiting for human approval on Notion page: ${pageId}`);
  

  await logAudit(threadId, "System", "Requested Human Approval", "WAITING", "", `Notion Page ID: ${pageId}`);
  
  return { notionPageId: pageId };
}

async function executeActionNode(state: typeof GraphState.State, config?: any) {
  const threadId = config?.configurable?.thread_id;
  if (state.humanApproved) {
    console.log(`[DEVOPS] Starting execution pipeline...`);
    
    const proposal = state.proposal || {
      title: "AI-Native Enterprise Architecture Upgrade",
      description: "Automated ML enterprise workflow engine with anomaly detection and automated multi-tier financial report generator.",
      budget: state.maxBudget || 45000,
      analysis: { timeEstimation: "15 Days" }
    };

    // Parse time estimation to days (default 15 if parsing fails)
    let days = 15;
    if (proposal.analysis?.timeEstimation) {
      const match = proposal.analysis.timeEstimation.match(/(\d+)/);
      if (match) days = parseInt(match[1]);
    }
    
    // Calculate deadline Date
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + days);
    deadlineDate.setHours(17, 0, 0, 0); // 5:00 PM
    
    // Append deadline to the GitHub issue description
    const issueBody = `${proposal.description}\n\n### ✅ Task List\n- [ ] Review architecture proposal\n- [ ] Setup initial repository structure\n- [ ] Implement core features\n- [ ] Code review and testing\n\n---\n🚨 **URGENT:** This work must be completed by **${deadlineDate.toLocaleString()}**.`;
    
    // Generate Boilerplate Code
    const boilerplateFiles = await engineeringAgent.generateBoilerplateCode(proposal);
    
    // Get assignees from env or use defaults
    const assignees = Array.from(new Set([
      process.env.GITHUB_ENGINEER_1 || "engineer1",
      process.env.GITHUB_ENGINEER_2 || "engineer2"
    ].filter(Boolean))); // removes duplicates and empty strings
    
    // Create a calendar event for tomorrow
    const kickoffDate = new Date();
    kickoffDate.setDate(kickoffDate.getDate() + 1);
    kickoffDate.setHours(10, 0, 0, 0); // 10:00 AM tomorrow
    
    const userEmail = state.userEmail || process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com";
    const actualManagerEmail = process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com";
    const recipients = Array.from(new Set([userEmail, actualManagerEmail])).join(", ");

    // Run all external actions in parallel to speed up approval
    await Promise.all([
      sendSlackMessage(`Architecture "${proposal.title}" has been fully approved by Manager. Initiating kickoff! Budget: ₹${proposal.budget}\nDeadline: ${deadlineDate.toDateString()}`),
      createGithubIssue(proposal.title, issueBody, ["engineering", "approved"], assignees),
      createGithubPullRequest(proposal.title, issueBody, boilerplateFiles, assignees),
      sendNotificationEmail(recipients, `New Pull Request Created: ${proposal.title}`, `A new GitHub Pull Request with boilerplate code has been successfully created and assigned to you and your team.\n\nProject: ${proposal.title}\nDeadline: ${deadlineDate.toLocaleString()}\n\nPlease check your GitHub repository for more details.`),
      createCalendarEvent(`Kickoff: ${proposal.title}`, kickoffDate, ["engineering@enterprisepilot.ai", userEmail, actualManagerEmail])
    ]);

    if (threadId) await logAudit(threadId, "DevOps", "Executing Pipeline", "SUCCESS");
  } else {
    console.log(`[ORCHESTRATOR] Architecture proposal was rejected by human manager. Scheduling sync-up call.`);
    if (threadId) await logAudit(threadId, "DevOps", "Pipeline Aborted - Scheduling Meeting", "REJECTED");
    
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + 1);
    meetingDate.setHours(10, 0, 0, 0);

    const featureTitle = state.proposal?.title || "Workflow";
    const userEmail = state.userEmail || process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com";
    const actualManagerEmail = process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com";
    
    // Use Set to avoid sending duplicate emails if user is the manager
    const recipients = Array.from(new Set([userEmail, actualManagerEmail])).join(", ");
    const calendarAttendees = Array.from(new Set(["engineering@enterprisepilot.ai", userEmail, actualManagerEmail]));

    const calendarResult = await createCalendarEvent(`Sync-up: ${featureTitle}`, meetingDate, calendarAttendees);
    await sendNotificationEmail(recipients, `Proposal Rejected: ${featureTitle}`, `The manager rejected the proposal. A sync-up call has been scheduled for tomorrow at 10 AM.`, calendarResult.icsContent);
  }
  return {};
}

async function scheduleMeetingNode(state: typeof GraphState.State, config?: any) {
  const threadId = config?.configurable?.thread_id;
  console.log(`[ORCHESTRATOR] Max negotiation rounds reached. Scheduling sync-up call.`);
  if (threadId) await logAudit(threadId, "System", "Negotiation Failed - Scheduling Meeting", "FAILED");
  
  const meetingDate = new Date();
  meetingDate.setDate(meetingDate.getDate() + 1);
  meetingDate.setHours(10, 0, 0, 0);

  const featureTitle = state.proposal?.title || "Workflow";
  const userEmail = state.userEmail || process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com";
  const actualManagerEmail = process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com";

  // Use Set to avoid duplicate attendees
  const recipients = Array.from(new Set([userEmail, actualManagerEmail])).join(", ");
  const calendarAttendees = Array.from(new Set(["engineering@enterprisepilot.ai", "finance@enterprisepilot.ai", userEmail, actualManagerEmail]));

  const calendarResult = await createCalendarEvent(`Escalation Sync: ${featureTitle}`, meetingDate, calendarAttendees);
  await sendNotificationEmail(recipients, `Escalation: Negotiation Failed for ${featureTitle}`, `Agents failed to reach an agreement after 3 rounds. A sync-up call has been scheduled for tomorrow at 10 AM.`, calendarResult.icsContent);
  
  return {};
}

function routeAfterFinance(state: typeof GraphState.State) {
  if (state.budgetApprovedByFinance) {
    return "qa";
  } else if ((state.negotiationRound || 0) >= 3) {
    return "scheduleMeeting";
  } else {
    return "engineering";
  }
}

function routeAfterApprovalRequest(state: typeof GraphState.State) {
  if (state.humanApproved !== undefined) {
    return "executeAction";
  }
  return END;
}

const workflow = new StateGraph(GraphState)
  .addNode("engineering", engineeringNode)
  .addNode("finance", financeNode)
  .addNode("qa", qaNode)
  .addNode("requestHumanApproval", requestHumanApprovalNode)
  .addNode("executeAction", executeActionNode)
  .addNode("scheduleMeeting", scheduleMeetingNode)
  .addEdge(START, "engineering")
  .addEdge("engineering", "finance")
  .addConditionalEdges("finance", routeAfterFinance)
  .addEdge("scheduleMeeting", END)
  .addEdge("qa", "requestHumanApproval")
  .addEdge("requestHumanApproval", "executeAction")
  .addEdge("executeAction", END);

const checkpointer = (global as any).__checkpointer || new MemorySaver();
(global as any).__checkpointer = checkpointer;

export const orchestratorApp = workflow.compile({ 
  checkpointer,
  interruptBefore: ["executeAction"]
});

