import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export class MarketingAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.7 });
    }
  }

  /**
   * The marketing agent receives a goal and generates a campaign proposal.
   */
  async proposeCampaign(goal: string): Promise<{ title: string; budget: number; description: string }> {
    if (!this.llm) {
      console.log(`[MARKETING AGENT] (Mock Mode) Proposing campaign for goal: ${goal}`);
      return {
        title: "Summer 2026 Blast",
        budget: 60000,
        description: "A huge summer launch campaign involving influencers and paid ads."
      };
    }

    const response = await this.llm.invoke([
      new SystemMessage("You are the Marketing Agent. Propose a campaign based on the user goal. Output ONLY valid JSON with keys 'title', 'budget' (number), and 'description'."),
      new HumanMessage(goal)
    ]);

    try {
      const parsed = JSON.parse(response.content as string);
      return {
        title: parsed.title,
        budget: Number(parsed.budget),
        description: parsed.description
      };
    } catch (e) {
      // Fallback
      return { title: "AI Generated Campaign", budget: 60000, description: "Generated description." };
    }
  }

  /**
   * Adjusts the budget based on Finance's feedback.
   */
  async reviseBudget(currentProposal: any, financeFeedback: string): Promise<number> {
    if (!this.llm) {
      console.log(`[MARKETING AGENT] (Mock Mode) Revising budget based on feedback: ${financeFeedback}`);
      // Simple mock logic: just reduce by 20%
      return currentProposal.budget * 0.8;
    }

    const response = await this.llm.invoke([
      new SystemMessage("You are the Marketing Agent. Finance rejected your budget. Given the feedback, return ONLY a number representing the new revised budget."),
      new HumanMessage(`Current Budget: ${currentProposal.budget}\nFeedback: ${financeFeedback}`)
    ]);

    return Number(response.content) || (currentProposal.budget * 0.8);
  }
}
