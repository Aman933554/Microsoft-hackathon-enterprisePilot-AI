import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export class EngineeringAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.7 });
    }
  }

  /**
   * Analyzes incoming feature requests and estimates implementation complexity.
   */
  async proposeImplementation(goal: string): Promise<{ title: string; budget: number; description: string; complexity: string }> {
    if (!this.llm) {
      console.log(`[ENGINEERING AGENT] (Mock Mode) Proposing implementation for goal: ${goal}`);
      return {
        title: "AI Expense Predictor Architecture",
        budget: 60000,
        description: "Full-stack implementation of AI expense predictor with real-time ML inference.",
        complexity: "High"
      };
    }

    const response = await this.llm.invoke([
      new SystemMessage("You are the Engineering Agent. Propose a software architecture based on the user's feature request. Output ONLY valid JSON with keys 'title', 'budget' (number), 'description', and 'complexity' (High/Medium/Low)."),
      new HumanMessage(goal)
    ]);

    try {
      const parsed = JSON.parse(response.content as string);
      return {
        title: parsed.title,
        budget: Number(parsed.budget),
        description: parsed.description,
        complexity: parsed.complexity || "Medium"
      };
    } catch (e) {
      // Fallback
      return { title: "AI Feature Implementation", budget: 60000, description: "Generated description.", complexity: "Medium" };
    }
  }

  /**
   * Adjusts the budget and scope based on Finance's feedback, creating a real disagreement/tradeoff.
   */
  async reviseBudget(currentProposal: any, financeFeedback: string): Promise<{ budget: number; revisedDescription: string }> {
    if (!this.llm) {
      console.log(`[ENGINEERING AGENT] (Mock Mode) Revising budget based on feedback: ${financeFeedback}`);
      // Explicitly state what was cut for the hackathon "disagreement" criteria
      return { 
        budget: currentProposal.budget * 0.8,
        revisedDescription: `We have dropped the ML training pipeline and will fall back to a pre-trained model to meet the budget constraints.`
      };
    }

    const response = await this.llm.invoke([
      new SystemMessage("You are the Engineering Agent. Finance rejected your infrastructure budget. Given the feedback, you must cut some scope. Output ONLY valid JSON with keys 'budget' (number) and 'revisedDescription' (string explaining exactly what features were cut to meet the budget)."),
      new HumanMessage(`Current Proposal: ${JSON.stringify(currentProposal)}\nFinance Feedback: ${financeFeedback}`)
    ]);

    try {
      const parsed = JSON.parse(response.content as string);
      return {
        budget: Number(parsed.budget),
        revisedDescription: parsed.revisedDescription || "Cut generic scope to meet budget."
      };
    } catch (e) {
      return { 
        budget: currentProposal.budget * 0.8, 
        revisedDescription: "Reduced compute resources and dropped non-critical features to fit the budget." 
      };
    }
  }
}
