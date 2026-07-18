import { runDemo, resumeDemo } from "./run-graph";

async function test() {
  console.log("Running demo...");
  const res = await runDemo("Build AI Expense Predictor feature", 45000);
  console.log("Paused:", res.isPaused, "Thread:", res.threadId);
  
  console.log("Resuming demo...");
  try {
    await resumeDemo(res.threadId, true);
    console.log("Resumed successfully");
  } catch (e) {
    console.error("Failed to resume:", e);
  }
}

test();
