import "dotenv/config"; // Load environment variables FIRST
import { orchestratorApp } from "./orchestrator/graph";
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function runCLI() {
  console.log("\x1b[36m🚀 Starting AI-Native Enterprise Operating System (Premium Terminal Mode)...\x1b[0m\n");

  const threadConfig = { configurable: { thread_id: "cli-thread-" + Date.now() } };
  
  // Interactive Prompts
  const inputGoal = await askQuestion("\x1b[33m? What is your campaign goal? \x1b[0m");
  const inputBudgetStr = await askQuestion("\x1b[33m? What is your max finance policy budget? (e.g. 50000) \x1b[0m");
  
  const initialGoal = inputGoal || "Build a new scalable messaging queue for microservices.";
  const maxBudget = parseInt(inputBudgetStr) || 50000;

  console.log(`\n\x1b[32m[TRIGGER] New Goal:\x1b[0m ${initialGoal}`);
  console.log(`\x1b[35m[POLICY] Max Budget:\x1b[0m $${maxBudget}\n`);

  // 1. Start the workflow
  await orchestratorApp.invoke(
    { goal: initialGoal, maxBudget: maxBudget },
    threadConfig
  );

  const currentState = await orchestratorApp.getState(threadConfig);
  const nextNode = currentState.next?.[0];

  if (nextNode === "executeAction") {
    console.log("\n\x1b[43m\x1b[30m *** ORCHESTRATOR PAUSED *** \x1b[0m");
    console.log("\x1b[33mWorkflow is waiting for human approval...\x1b[0m");
    
    // 2. Pause and wait for human input from the terminal
    const answer = await askQuestion("\n\x1b[36mType 'approve' or 'reject' to simulate the Notion webhook: \x1b[0m");
    const isApproved = answer.toLowerCase().trim() === 'approve';
    
    console.log(`\n\x1b[35m[NOTION WEBHOOK]\x1b[0m Received webhook: ${isApproved ? 'Approved ✅' : 'Rejected ❌'}`);
    
    // 3. Update the state with the human's decision
    await orchestratorApp.updateState(
      threadConfig,
      { humanApproved: isApproved }
    );

    // 4. Resume execution
    await orchestratorApp.invoke(null, threadConfig);
    
    console.log("\n\x1b[32m✅ Demo Complete.\x1b[0m");
    rl.close();
  } else {
    console.log("\n\x1b[32m✅ Demo Complete.\x1b[0m");
    rl.close();
  }
}

runCLI().catch(e => {
  console.error(e);
  rl.close();
});
