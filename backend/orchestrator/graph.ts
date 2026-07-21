import { StateGraph, START, END, MemorySaver, Annotation } from "@langchain/langgraph";
import { EngineeringAgent } from "../agents/engineering";
import { FinanceAgent } from "../agents/finance";
import { QAAgent } from "../agents/qa";
import { AgentNotionClient } from "../notion/client";
import { sendSlackMessage } from "../tools/slack";
import { sendApprovalEmail } from "../tools/email";
import { createGithubIssue } from "../tools/github";

// Define the state for the workflow
export const GraphState = Annotation.Root({
  goal: Annotation<string>(),
  maxBudget: Annotation<number>(),
  proposal: Annotation<any>(),
  budgetApprovedByFinance: Annotation<boolean>(),
  financeFeedback: Annotation<string>(),
  qaChecklist: Annotation<any>(),
  notionPageId: Annotation<string>(),
  humanApproved: Annotation<boolean>(),
});

const engineeringAgent = new EngineeringAgent();
const financeAgent = new FinanceAgent();
const qaAgent = new QAAgent();

// Load tokens from env (or run in mock mode if absent)
const engineeringNotion = new AgentNotionClient("Engineering", process.env.NOTION_ENGINEERING_TOKEN || process.env.NOTION_MARKETING_TOKEN);
const financeNotion = new AgentNotionClient("Finance", process.env.NOTION_FINANCE_TOKEN);

/**
 * Node: Engineering proposes or revises the architecture
 */
async function engineeringNode(state: typeof GraphState.State) {
  let newProposal;
  if (!state.proposal) {
    newProposal = await engineeringAgent.proposeImplementation(state.goal);
  } else {
    const revised = await engineeringAgent.reviseBudget(state.proposal, state.financeFeedback);
    newProposal = { ...state.proposal, budget: revised.budget, revisedDescription: revised.revisedDescription };
  }
  
  await engineeringNotion.logCampaignProposal({
    title: newProposal.title,
    budget: newProposal.budget,
    status: "Draft",
    rationale: state.financeFeedback ? `Revised based on Finance feedback: ${state.financeFeedback}\nCuts: ${newProposal.revisedDescription}` : "Initial proposal generated for goal"
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
 * Node: QA reviews and generates a checklist
 */
async function qaNode(state: typeof GraphState.State) {
  const result = await qaAgent.generateChecklist(state.proposal);
  console.log(`[QA AGENT] Evaluated risk as ${result.riskLevel}. Generated checklist.`);
  return { qaChecklist: result };
}

/**
 * Node: Request Human Approval via Notion
 */
async function requestHumanApprovalNode(state: typeof GraphState.State, config?: any) {
  // Request final approval using the enhanced Notion integration
  const pageId = await financeNotion.requestHumanApproval(state.proposal, state.financeFeedback || "QA Checklist Generated.", state.qaChecklist);
  console.log(`\n*** ORCHESTRATOR PAUSED ***`);
  console.log(`[SYSTEM] Creating Approval Request in Notion...`);
  
  // Actually send the email (will use Ethereal if no SMTP credentials exist)
  const threadId = config?.configurable?.thread_id || "demo-thread";
  await sendApprovalEmail(state.proposal.budget, state.proposal.title, threadId);

  console.log(`[SLACK] 🚨 Approval Required for Engineering Budget: ₹${state.proposal.budget}. Risk: ${state.qaChecklist?.riskLevel}. Review in Notion.`);
  console.log(`[SYSTEM] 🔔 Triggered Browser Push Notification: "Waiting for Manager Approval".`);
  console.log(`Workflow is waiting for human approval on Notion page: ${pageId}`);
  return { notionPageId: pageId };
}

/**
 * Node: Execute the final action after human approval
 */
async function executeActionNode(state: typeof GraphState.State) {
  if (state.humanApproved) {
    await sendSlackMessage(`Feature "${state.proposal.title}" has been fully approved by Manager and is now in Jira! Budget: ₹${state.proposal.budget}`);
    await createGithubIssue(state.proposal.title, state.proposal.description, ["engineering", "approved"]);
  } else {
    console.log(`[ORCHESTRATOR] Feature proposal was rejected by human manager.`);
  }
  return {};
}

// Router to decide what happens after Finance reviews
function routeAfterFinance(state: typeof GraphState.State) {
  if (state.budgetApprovedByFinance) {
    return "qa";
  } else {
    return "engineering";
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
  .addNode("engineering", engineeringNode)
  .addNode("finance", financeNode)
  .addNode("qa", qaNode)
  .addNode("requestHumanApproval", requestHumanApprovalNode)
  .addNode("executeAction", executeActionNode)

  .addEdge(START, "engineering")
  .addEdge("engineering", "finance")
  .addConditionalEdges("finance", routeAfterFinance)
  .addEdge("qa", "requestHumanApproval")
  .addEdge("requestHumanApproval", "executeAction")
  .addEdge("executeAction", END);

// Compile the graph with a memory saver to allow pausing
const checkpointer = (global as any).__checkpointer || new MemorySaver();
(global as any).__checkpointer = checkpointer;

export const orchestratorApp = workflow.compile({ 
  checkpointer,
  interruptBefore: ["executeAction"]
});
