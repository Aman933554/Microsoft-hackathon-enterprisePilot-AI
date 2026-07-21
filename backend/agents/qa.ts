import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export class QAAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.2 });
    }
  }

  /**
   * Evaluates the risk and generates a QA checklist based on the final proposal.
   */
  async generateChecklist(proposal: any): Promise<{ riskLevel: string; checklist: string[] }> {
    if (!this.llm) {
      console.log(`[QA AGENT] (Mock Mode) Generating checklist for: ${proposal.title}`);
      return {
        riskLevel: "Medium",
        checklist: [
          "Verify machine learning model accuracy meets 95% threshold",
          "Conduct security review on PII data handling",
          "Ensure sub-200ms latency on real-time inference",
          "Run automated E2E tests for the new dashboard UI"
        ]
      };
    }

    const response = await this.llm.invoke([
      new SystemMessage("You are the QA Agent. Based on the engineering proposal, evaluate the implementation risk and generate a testing checklist. Output ONLY valid JSON with keys 'riskLevel' (High/Medium/Low) and 'checklist' (array of strings)."),
      new HumanMessage(JSON.stringify(proposal))
    ]);

    try {
      const parsed = JSON.parse(response.content as string);
      return {
        riskLevel: parsed.riskLevel || "Medium",
        checklist: parsed.checklist || ["Standard E2E tests", "Security review"]
      };
    } catch (e) {
      // Fallback
      return { riskLevel: "Medium", checklist: ["Fallback test 1", "Fallback test 2"] };
    }
  }
}
