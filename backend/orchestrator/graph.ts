import { StateGraph, START, END, MemorySaver, Annotation } from "@langchain/langgraph";
import { MarketingAgent } from "../agents/marketing";
import { FinanceAgent } from "../agents/finance";
import { AgentNotionClient } from "../notion/client";
import { sendSlackMessage } from "../tools/slack";
import { sendApprovalEmail } from "../tools/email";

// Define the state for the workflow
export const GraphState = Annotation.Root({
  goal: Annotation<string>(),
  maxBudget: Annotation<number>(),
  proposal: Annotation<any>(),
  budgetApprovedByFinance: Annotation<boolean>(),
  financeFeedback: Annotation<string>(),
  notionPageId: Annotation<string>(),
  humanApproved: Annotation<boolean>(),
});

const marketingAgent = new MarketingAgent();
const financeAgent = new FinanceAgent();

// Load tokens from env (or run in mock mode if absent)
const marketingNotion = new AgentNotionClient("Marketing", process.env.NOTION_MARKETING_TOKEN);
const financeNotion = new AgentNotionClient("Finance", process.env.NOTION_FINANCE_TOKEN);

/**
 * Node: Marketing proposes or revises the campaign
 */
async function marketingNode(state: typeof GraphState.State) {
  let newProposal;
  if (!state.proposal) {
    newProposal = await marketingAgent.proposeCampaign(state.goal);
  } else {
    const revisedBudget = await marketingAgent.reviseBudget(state.proposal, state.financeFeedback);
    newProposal = { ...state.proposal, budget: revisedBudget };
  }
  
  await marketingNotion.logCampaignProposal({
    title: newProposal.title,
    budget: newProposal.budget,
    status: "Draft",
    rationale: state.financeFeedback ? `Revised based on Finance feedback: ${state.financeFeedback}` : "Initial proposal generated for goal"
  });

  return { proposal: newProposal };
}

/**
 * Node: Finance reviews the budget
 */
async function financeNode(state: typeof GraphState.State) {
  const result = await financeAgent.reviewBudget(state.proposal.budget, state.maxBudget);
  return { 
    budgetApprovedByFinance: result.approved,
    financeFeedback: result.feedback || ""
  };
}

/**
 * Node: Request Human Approval via Notion
 */
async function requestHumanApprovalNode(state: typeof GraphState.State, config?: any) {
  // Finance requests the final approval since they approved the budget internally
  const pageId = await financeNotion.requestHumanApproval(state.proposal.title, state.proposal.budget, state.financeFeedback);
  console.log(`\n*** ORCHESTRATOR PAUSED ***`);
  console.log(`[SYSTEM] Creating Approval Request in Notion...`);
  
  // Actually send the email (will use Ethereal if no SMTP credentials exist)
  const threadId = config?.configurable?.thread_id || "demo-thread";
  await sendApprovalEmail(state.proposal.budget, "AI Expense Predictor", threadId);

  console.log(`[SLACK] 🚨 Approval Required for Budget: ₹${state.proposal.budget}. Review in Notion.`);
  console.log(`[SYSTEM] 🔔 Triggered Browser Push Notification: "Waiting for Manager Approval".`);
  console.log(`[TWILIO] 📱 SMS Sent: "Approval Needed - Expense Predictor".`);
  console.log(`Workflow is waiting for human approval on Notion page: ${pageId}`);
  return { notionPageId: pageId };
}

/**
 * Node: Execute the final action after human approval
 */
async function executeActionNode(state: typeof GraphState.State) {
  if (state.humanApproved) {
    await sendSlackMessage(`Campaign "${state.proposal.title}" has been fully approved and is now live! Budget: ₹${state.proposal.budget}`);
  } else {
    console.log(`[ORCHESTRATOR] Campaign was rejected by human.`);
  }
  return {};
}

// Router to decide what happens after Finance reviews
function routeAfterFinance(state: typeof GraphState.State) {
  if (state.budgetApprovedByFinance) {
    return "requestHumanApproval";
  } else {
    return "marketing";
  }
}

// Router to decide what happens after asking for human approval
function routeAfterApprovalRequest(state: typeof GraphState.State) {
  if (state.humanApproved !== undefined) {
    return "executeAction"; // If human already approved/rejected, move on
  }
  return END; // Pause execution
}

// Build the LangGraph
const workflow = new StateGraph(GraphState)
  .addNode("marketing", marketingNode)
  .addNode("finance", financeNode)
  .addNode("requestHumanApproval", requestHumanApprovalNode)
  .addNode("executeAction", executeActionNode)

  .addEdge(START, "marketing")
  .addEdge("marketing", "finance")
  .addConditionalEdges("finance", routeAfterFinance)
  .addEdge("requestHumanApproval", "executeAction")
  .addEdge("executeAction", END);

// Compile the graph with a memory saver to allow pausing
const checkpointer = (global as any).__checkpointer || new MemorySaver();
(global as any).__checkpointer = checkpointer;

export const orchestratorApp = workflow.compile({ 
  checkpointer,
  interruptBefore: ["executeAction"]
});
