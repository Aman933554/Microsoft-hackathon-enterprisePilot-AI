import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

const qaReviewSchema = z.object({
  riskLevel: z.enum(["High", "Medium", "Low"]).describe("The assessed risk level of implementing this architecture."),
  checklist: z.array(z.string()).describe("A list of testing, security, and compliance tasks required before this can go to production."),
  analysis: z.object({
    riskScore: z.number().min(0).max(100).describe("Quantitative risk score out of 100."),
    testStrategy: z.string().describe("Recommended overall testing strategy (e.g. E2E, Load Testing)."),
    securityChecklist: z.array(z.string()).describe("Security specific checks (e.g. SAST, PII audit)."),
    deploymentReadiness: z.string().describe("Status of deployment readiness."),
    qualityReport: z.string().describe("A brief summary of architectural quality."),
    recommendation: z.string().describe("Final QA recommendation (e.g., Proceed with caution).")
  })
});

export class QAAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.2 });
    }
  }

  async generateChecklist(proposal: any): Promise<{ riskLevel: string; checklist: string[]; analysis: any }> {
    
    if (!this.llm) {
      console.log(`[QA AGENT] (Mock Mode) Generating checklist for: ${proposal.title}`);
      return {
        riskLevel: "Medium",
        checklist: [
          "Verify machine learning model accuracy meets 95% threshold",
          "Conduct security review on PII data handling",
          "Ensure sub-200ms latency on real-time inference",
          "Run automated E2E tests for the new dashboard UI"
        ],
        analysis: {
          riskScore: 78,
          testStrategy: "Automated API E2E, Load Testing for High Availability, and manual exploratory testing on frontend.",
          securityChecklist: ["Audit PII data", "Run static application security testing (SAST)", "Validate IAM roles"],
          deploymentReadiness: "Pending Security Review",
          qualityReport: "Initial review shows solid architecture, but high risk due to untested AI integration.",
          recommendation: "Proceed with caution. Require security sign-off before production."
        }
      };
    }

    const structuredLlm = this.llm.withStructuredOutput(qaReviewSchema);

    const systemPrompt = `You are the Lead QA & Security Engineer AI Agent. 
    Review the Engineering proposal and generate a comprehensive risk assessment and testing checklist.
    Identify any potential bottlenecks, compliance issues, or security flaws in the proposed architecture.`;

    const response = await structuredLlm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(JSON.stringify(proposal))
    ]);

    console.log(`[QA AGENT] Evaluated risk as ${response.riskLevel}. Generated checklist.`);
    return response;
  }
}
