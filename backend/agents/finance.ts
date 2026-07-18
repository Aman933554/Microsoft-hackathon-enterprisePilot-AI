import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export class FinanceAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
    }
  }

  /**
   * Reviews the budget. Rejects if > 50,000, approves otherwise.
   */
  async reviewBudget(budget: number, maxBudget: number): Promise<{ approved: boolean; feedback?: string }> {
    if (budget <= maxBudget) {
      console.log(`[FINANCE AGENT] Budget of $${budget} is within policy (<= $${maxBudget}). Approved.`);
      return { approved: true };
    }

    if (!this.llm) {
      const feedback = `Budget of $${budget} exceeds our policy limit of $${maxBudget}. Please reduce the budget.`;
      console.log(`[FINANCE AGENT] (Mock Mode) Rejected: ${feedback}`);
      return { approved: false, feedback };
    }

    const response = await this.llm.invoke([
      new SystemMessage(`You are the Finance Agent. The maximum budget allowed is $${maxBudget}. Generate a polite but firm rejection message explaining the policy limit.`),
      new HumanMessage(`Marketing requested: $${budget}`)
    ]);

    console.log(`[FINANCE AGENT] Rejected: ${response.content}`);
    return { approved: false, feedback: response.content as string };
  }
}
